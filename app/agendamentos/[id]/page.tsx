"use client";

import { getAgendamentoById } from "@/app/actions/get-agendamentos";
import { getAllClientes } from "@/app/actions/get-clientes";
import { updateAgendamento } from "@/app/actions/update-agendamento";
import { AgendamentoFull, ClienteFull, ClienteWVeiculo } from "@/app/page";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { CircleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface SchemaVeiculo {
  veiculo: Veiculo;
  isChecked: boolean;
  price: number;
  observacao: string;
}

interface UpdateAgendamentoPageProps {
  params: {
    id: string;
  };
}

function calculatePrice(eixos: number) {
  switch (eixos) {
    case 9:
      return 110;
    case 8:
      return 100;
    case 7:
      return 90;
    case 6:
      return 80;
    case 5:
      return 75;
    case 4:
      return 70;
    case 3:
      return 60;
    case 2:
      return 50;
  }
}

const UpdateAgendamentoPage = ({ params }: UpdateAgendamentoPageProps) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const idRef = useRef<any>(null);
  const clienteRef = useRef<any>(null);
  const dateRef = useRef<any>(null);
  const dateIsDoneRef = useRef<any>(null);
  const isDoneRef = useRef<any>(null);
  const priceRef = useRef<any>(null);
  const paymentMethod = useRef<any>(null);

  const [agendamento, setAgendamento] = useState<AgendamentoFull | null>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] =
    useState<ClienteWVeiculo | null>(null);
  const [veiculos, setVeiculos] = useState<SchemaVeiculo[]>([]);
  const [visibleVeiculos, setVisibleVeiculos] = useState<SchemaVeiculo[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);

  const [isPending, startTransition] = useTransition();

  type UpdatedAgendamento = Pick<
    Agendamento,
    | "clienteId"
    | "date"
    | "serviceCompleted"
    | "id"
    | "pricePerVeiculo"
    | "price"
    | "paid"
    | "paymentMethod"
  >;

  const formSubmit = (e: any) => {
    e.preventDefault();

    startTransition(() => {
      if (selectedCliente?.id) {
        const selectedVeiculos: Veiculo[] = [];
        veiculos.forEach((item) => {
          item.isChecked && selectedVeiculos.push(item.veiculo);
        });
        let prices: JsonValue = [];
        veiculos.forEach((item) => {
          if (item.isChecked) {
            prices.push({
              price: item.price,
              veiculoId: item.veiculo.id,
              observacao: item.observacao,
            });
          }
        });

        const updatedAgendamento: UpdatedAgendamento = {
          id: parseInt(idRef.current.value),
          clienteId: selectedCliente.id,
          date: new Date(new Date(dateRef.current.value).setUTCHours(12)),
          serviceCompleted: isDone
            ? new Date(new Date(dateIsDoneRef.current.value).setUTCHours(12))
            : null,
          paid: isPaid,
          paymentMethod: paymentMethod.current.value,
          pricePerVeiculo: prices,
          price: parseFloat(
            priceRef.current.value
              .replace("R$", "")
              .trim()
              .replaceAll(".", "")
              .replace(",", ".")
          ),
        };

        data?.user &&
          updateAgendamento(updatedAgendamento, selectedVeiculos, data.user)
            .then((res) => {
              toast.success("Agendamento alterado com sucesso!");
              setTimeout(() => {
                window.location.reload();
              }, 500);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Não foi possível alterar o agendamento!");
            });
      }
    });
  };

  useEffect(() => {
    startTransition(() => {
      if (data?.user && params.id) {
        getAllClientes(data.user)
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
          });
        getAgendamentoById(parseInt(params.id.toString()), data.user).then(
          (res) => {
            if (res) {
              setAgendamento(res);
              setSelectedCliente(res.cliente);
            }
          }
        );
      } else {
        toast.error("Não possível encontrar dados cadastrados!");
      }
    });
  }, [data, params]);

  /*   useEffect(() => {
    if (params.id) {
      data?.user &&
        getAgendamentoById(parseInt(params.id), data.user)
          .then((res) => {
            setAgendamento(res);
            setSelectedCliente(res?.cliente);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Não foi possível encontrar o cliente!");
          });
    }
  }, [params, data]); */

  useEffect(() => {
    setPrice(agendamento?.price || 0);
    setIsPaid(agendamento?.paid || false);
    idRef.current.value = agendamento?.id;
    let dateFormat = `${Intl.DateTimeFormat("eng", { year: "numeric" }).format(
      agendamento?.date
    )}-${Intl.DateTimeFormat("eng", { month: "2-digit" }).format(
      agendamento?.date
    )}-${Intl.DateTimeFormat("eng", { day: "2-digit" }).format(
      agendamento?.date
    )}`;
    dateRef.current.value = dateFormat;
    priceRef.current.value = Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(agendamento?.price || 0);
    paymentMethod.current.value = agendamento?.paymentMethod;
    if (agendamento?.serviceCompleted) {
      let dateIsDoneFormat = `${Intl.DateTimeFormat("eng", {
        year: "numeric",
      }).format(agendamento?.serviceCompleted)}-${Intl.DateTimeFormat("eng", {
        month: "2-digit",
      }).format(agendamento?.serviceCompleted)}-${Intl.DateTimeFormat("eng", {
        day: "2-digit",
      }).format(agendamento?.serviceCompleted)}`;

      setIsDone(true);
      dateIsDoneRef.current.value = dateIsDoneFormat;
    }

    if (selectedCliente) {
      if (data?.user) {
        startTransition(() => {
          let localCliente = selectedCliente;
          let arrayVeiculos: SchemaVeiculo[] = [];
          if (localCliente) {
            localCliente.veiculos.map((veiculo) => {
              let thisPrice: any = agendamento?.pricePerVeiculo.find(
                (item: any) => {
                  if (item?.veiculoId === veiculo.id) {
                    return item;
                  }
                }
              );
              if (
                agendamento?.veiculos.find(
                  (e) => e.veiculo.id === veiculo.id
                ) &&
                thisPrice
              ) {
                arrayVeiculos.push({
                  veiculo: veiculo,
                  isChecked: true,
                  observacao: thisPrice.observacao,
                  price: thisPrice.price
                    ? thisPrice.price
                    : calculatePrice(veiculo.numEixos) || 0,
                });
              } else {
                arrayVeiculos.push({
                  veiculo: veiculo,
                  isChecked: false,
                  observacao: "",
                  price: calculatePrice(veiculo.numEixos) || 0,
                });
              }
            });
            setVeiculos(arrayVeiculos || []);
          }
          /*         getClienteById(selectedCliente.id, data.user)
            .then((res) => {})
            .catch((err) => {
              console.log(err);
              toast.error("Erro ao buscar cliente!");
            }); */
        });
      } else {
        toast.error("Não possível encontrar dados cadastrados!");
      }
    }
  }, [selectedCliente, agendamento, data]);

  useEffect(() => {
    let sum = 0;
    veiculos.forEach((veiculo) => {
      if (veiculo.isChecked) {
        sum += veiculo.price;
      }
    });
    setPrice(sum);

    visibleVeiculos.length === 0 &&
      setVisibleVeiculos(() => {
        const newObj = [...veiculos];
        return newObj;
      });
  }, [veiculos]);

  return (
    <div className="flex justify-center mt-[90px]">
      <div className="px-8 pt-8 w-full max-w-[600px]">
        {isPending && <Loader />}
        <form className="flex flex-col">
          <label className="me-2 text-lg" htmlFor="id">
            id
          </label>
          <input
            ref={idRef}
            type="number"
            className="px-1 h-7 max-w-[100px] rounded-sm text-primary-foreground mb-2"
            name="id"
            readOnly
          />
          <label htmlFor="cliente" className="text-lg">
            Cliente
          </label>
          <select
            required
            ref={clienteRef}
            value={selectedCliente?.id}
            disabled
            name="cliente"
            className="px-1 h-7 text-primary-foreground rounded-sm mb-2"
          >
            <option value={-1}>Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.name}
              </option>
            ))}
          </select>
          <label htmlFor="veiculos" className="text-lg">
            Veículos
          </label>
          <Input
            className="bg-primary text-primary-foreground h-7 w-64"
            placeholder="buscar veículos..."
            onChange={(e) =>
              setVisibleVeiculos(() => {
                const newObj = [...veiculos].filter((item) => {
                  return (
                    item.veiculo.modelo
                      .toUpperCase()
                      .includes(e.target.value.toUpperCase()) ||
                    item.veiculo.fabricante
                      ?.toUpperCase()
                      .includes(e.target.value.toUpperCase()) ||
                    item.veiculo.placa
                      ?.toUpperCase()
                      .includes(e.target.value.toUpperCase()) ||
                    item.veiculo.frota
                      ?.toUpperCase()
                      .includes(e.target.value.toUpperCase())
                  );
                });
                return newObj;
              })
            }
          />
          <div className="ps-3">
            <input
              type="checkbox"
              onChange={(e) => {
                setVeiculos((objs) => {
                  let newObjs = [...objs];
                  newObjs.forEach((obj) => (obj.isChecked = e.target.checked));
                  return newObjs;
                });
              }}
              className="me-2"
            />
            <span>marcar todos</span>
          </div>
          <ScrollArea className="h-[150px] w-full max-w-[500px] rounded-md border border-primary p-2 mb-2">
            <div className="flex flex-col gap-3">
              {visibleVeiculos.map((item) => (
                <div
                  key={item.veiculo.id}
                  className="h-9 flex w-full items-center"
                >
                  <input
                    checked={item.isChecked}
                    type="checkbox"
                    className="me-2"
                    value={item.veiculo.id}
                    onChange={(e) => {
                      setVeiculos((objs) => {
                        let newObjs = [...objs];
                        newObjs.forEach((obj) => {
                          if (obj.veiculo.id === parseInt(e.target.value))
                            obj.isChecked = e.target.checked;
                        });
                        return newObjs;
                      });
                    }}
                  />
                  <input
                    id={item.veiculo.id.toString()}
                    defaultValue={Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price)}
                    onChange={(e) => {
                      setVeiculos((objs) => {
                        let newObjs = [...objs];
                        newObjs.forEach((obj) => {
                          if (obj.veiculo.id === parseInt(e.target.id)) {
                            obj.price = parseFloat(
                              e.target.value.replace(",", ".")
                            );
                          }
                        });

                        return newObjs;
                      });
                    }}
                    onBlur={(e) => {
                      let valueFormat = Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(parseFloat(e.target.value.replace(",", ".")));
                      e.target.value = valueFormat;
                    }}
                    onFocus={(e) => {
                      e.target.value = e.target.value.replace("R$", "");
                      e.target.select();
                    }}
                    type="text"
                    className="h-7 max-w-[100px] rounded-sm text-primary-foreground me-2 text-end px-1"
                  />
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="p-0 me-2 hover:bg-transparent hover:text-yellow-400"
                        asChild
                      >
                        <CircleAlert />
                      </Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby="">
                      <div className="flex flex-col gap-1 items-end">
                        <label className="w-full">
                          Observações sobre o veículo
                        </label>
                        <Input
                          defaultValue={item.observacao}
                          className="bg-primary text-primary-foreground"
                          type="text"
                          id={item.veiculo.id.toString()}
                          onBlur={(e) => {
                            setVeiculos((objs) => {
                              let newObjs = [...objs];
                              newObjs.forEach((obj) => {
                                if (obj.veiculo.id === parseInt(e.target.id)) {
                                  obj.observacao = e.target.value;
                                }
                              });
                              return newObjs;
                            });
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <span className="truncate text-sm">
                    {item.veiculo.placa} \\ {item.veiculo.frota}
                  </span>
                </div>
              ))}
            </div>
            <ScrollBar className="bg-ring rounded-xl" />
          </ScrollArea>
          <label className="me-2 text-lg" htmlFor="valor">
            Valor
          </label>
          <input
            ref={priceRef}
            onBlur={(e) => {
              let valueFormat = Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(parseFloat(e.target.value.replace(",", ".")));
              e.target.value = valueFormat;
            }}
            onFocus={(e) => {
              e.target.value = price.toString();
              e.target.value = e.target.value.replace("R$", "");
              e.target.select();
            }}
            type="text"
            className="h-7 max-w-[150px] rounded-sm text-primary-foreground me-2 text-end px-1"
          />
          <div className="flex mb-2">
            <label className="me-2 text-lg" htmlFor="valor">
              Pago?
            </label>
            <input
              checked={isPaid}
              onChange={() => setIsPaid(!isPaid)}
              type="checkbox"
            />
          </div>
          <label className="me-2 text-lg" htmlFor="valor">
            Forma de pagamento
          </label>
          <select
            ref={paymentMethod}
            className="h-7 mb-2 max-w-[350px] rounded-sm text-primary-foreground me-2 text-start px-1"
          >
            <option value="0">Selecione uma forma de pagamento</option>
            <option value="pix">Pix</option>
            <option value="cartao">Cartão</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="boleto">Boleto</option>
          </select>
          <label className="me-2 text-lg" htmlFor="date">
            Data
          </label>
          <input
            required
            ref={dateRef}
            name="date"
            type="date"
            className="px-1 w-[200px] text-primary-foreground h-7 rounded-sm mb-2"
          />
          <label className="me-2 text-lg" htmlFor="date-finished">
            Data de conclusão
          </label>
          <div className="flex items-center mb-2">
            <input
              required
              ref={dateIsDoneRef}
              disabled={!isDone}
              name="date-finished"
              type="date"
              className="px-1 w-[200px] text-primary-foreground h-7 rounded-sm"
            />
            <input
              ref={isDoneRef}
              checked={isDone}
              type="checkbox"
              className="ms-2 me-1"
              onChange={(e) => setIsDone(e.target.checked)}
            />
            <span>Serviço concluído?</span>
          </div>
          <div className="mt-4">
            <Button variant="default" className="me-5" onClick={formSubmit}>
              Salvar
            </Button>
            <Link className="text-blue-400" href="/agendamentos/create">
              Novo
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAgendamentoPage;
