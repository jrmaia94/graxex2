"use client";

import { getAgendamentoById } from "@/app/actions/get-agendamentos";
import { getAllClientes, getClienteById } from "@/app/actions/get-clientes";
import { updateAgendamento } from "@/app/actions/update-agendamento";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface SchemaVeiculo {
  veiculo: Veiculo;
  isChecked: boolean;
  price: number;
}

interface UpdateAgendamentoPageProps {
  params: {
    id: string;
  };
}

interface AgendamentoFull extends Agendamento {
  cliente: Cliente;
  veiculos: {
    veiculo: Veiculo;
  }[];
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

  const [agendamento, setAgendamento] = useState<AgendamentoFull | null>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente>();
  const [veiculos, setVeiculos] = useState<SchemaVeiculo[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);

  const [isPending, startTransition] = useTransition();

  type UpdatedAgendamento = Pick<
    Agendamento,
    "clienteId" | "date" | "serviceCompleted" | "id"
  >;

  interface PricePerVeiculo {
    veiculoId: number;
    price: number;
  }
  const formSubmit = (e: any) => {
    e.preventDefault();

    startTransition(() => {
      if (selectedCliente?.id) {
        const updatedAgendamento: UpdatedAgendamento = {
          id: parseInt(idRef.current.value),
          clienteId: selectedCliente.id,
          date: new Date(new Date(dateRef.current.value).setHours(12)),
          serviceCompleted: isDone
            ? new Date(new Date(dateIsDoneRef.current.value).setHours(12))
            : null,
        };
        const selectedVeiculos: Veiculo[] = [];
        veiculos.forEach((item) => {
          item.isChecked && selectedVeiculos.push(item.veiculo);
        });

        data?.user &&
          updateAgendamento(updatedAgendamento, selectedVeiculos, data.user)
            .then((res) => {
              console.log(res);
              toast.success("Agendamento alterado com sucesso!");
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
      data?.user &&
        getAllClientes(data.user)
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Não possível buscar os clientes!");
          });
    });
  }, [data]);

  useEffect(() => {
    setPrice(agendamento?.price || 0);
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

    selectedCliente &&
      startTransition(() => {
        data?.user &&
          getClienteById(selectedCliente.id, data.user)
            .then((res) => {
              let arrayVeiculos: SchemaVeiculo[] = [];
              res?.veiculos.map((veiculo) => {
                console.log(agendamento);
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
                    price: thisPrice.price
                      ? thisPrice.price
                      : veiculo.numEixos * 10,
                  });
                } else {
                  arrayVeiculos.push({
                    veiculo: veiculo,
                    isChecked: false,
                    price: veiculo.numEixos * 10,
                  });
                }
              });
              setVeiculos(arrayVeiculos || []);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Erro ao buscar cliente!");
            });
      });
  }, [selectedCliente, agendamento, data]);

  useEffect(() => {
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
  }, [params, data]);

  useEffect(() => {
    let sum = 0;
    veiculos.forEach((veiculo) => {
      if (veiculo.isChecked) {
        sum += veiculo.price;
      }
    });
    setPrice(sum);
  }, [veiculos]);

  return (
    <div className="flex justify-center">
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
            onChange={() =>
              setSelectedCliente(clientes.find((cliente) => cliente.id))
            }
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
              {veiculos.map((item) => (
                <div key={item.veiculo.id} className="h-6 flex w-full">
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
                  <span className="text-wrap truncate">
                    {item.veiculo.fabricante} - {item.veiculo.modelo}
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
