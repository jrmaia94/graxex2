import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Agendamento, Veiculo } from "@prisma/client";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import CardCliente from "./card-cliente";
import { JsonValue } from "@prisma/client/runtime/library";
import { createAgendamento } from "@/app/actions/post-agendamento";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

interface SchemaVeiculo {
  veiculo: Veiculo;
  isChecked: boolean;
  price: number;
  observacao: string;
}

export const DialogAgendamento = ({
  isOpen,
  setIsOpen,
  veiculos: selectedVeiculos,
  cliente,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  veiculos: Veiculo[];
  cliente: any;
}) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const [dateIsDone, setDateIsDone] = useState<Date>(new Date(Date.now()));
  const paymentMethod = useRef<any>(null);
  const [veiculos, setVeiculos] = useState<SchemaVeiculo[]>([]);
  const [isDone, setIsDone] = useState<boolean>(true);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [isLoading, startTransition] = useTransition();

  const createAtendimento = () => {
    startTransition(() => {
      let prices: JsonValue = [];
      veiculos.forEach((item) => {
        if (item.isChecked) {
          prices.push({
            veiculoId: item.veiculo.id,
            price: item.price,
            observacao: item.observacao,
          });
        }
      });
      const agendamento: Pick<
        Agendamento,
        | "date"
        | "price"
        | "pricePerVeiculo"
        | "serviceCompleted"
        | "clienteId"
        | "paid"
        | "paymentMethod"
      > = {
        clienteId: cliente.id,
        date: date,
        price: price,
        paid: isPaid,
        paymentMethod: paymentMethod.current?.value || "",
        serviceCompleted: dateIsDone,
        pricePerVeiculo: prices,
      };

      const selectedVeiculos: Veiculo[] = [];
      veiculos.forEach(
        (item) => item.isChecked && selectedVeiculos.push(item.veiculo)
      );
      createAgendamento(
        { ...agendamento, veiculos: selectedVeiculos },
        data.user
      )
        .then((res) => {
          toast.success("Agendamento cadastrado com sucesso!");
          setTimeout(() => {
            setIsOpen(false);
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Houve um erro ao cadastrar o agendamento");
        });
    });
  };

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

  useEffect(() => {
    setVeiculos(() => {
      let newArray: SchemaVeiculo[] = [];
      let sum: number = 0;
      selectedVeiculos.forEach((item) => {
        newArray.push({
          isChecked: true,
          price: calculatePrice(item.numEixos) || 0,
          veiculo: item,
          observacao: "",
        });
        sum += calculatePrice(item.numEixos) || 0;
      });
      setPrice(sum);
      return newArray;
    });
  }, [selectedVeiculos, cliente]);

  useEffect(() => {
    let sum = 0;
    veiculos.forEach((item) => {
      if (item.isChecked) sum += item.price;
    });
    setPrice(sum);
  }, [veiculos]);

  return (
    <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] flex flex-col gap-1">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <CardCliente cliente={cliente} />
        </div>
        <ScrollArea className="h-[150px] w-full max-w-[500px] rounded-md border border-primary p-2">
          <div className="flex flex-col gap-2">
            {veiculos.map((item) => (
              <div
                key={item.veiculo.id}
                className="h-fit flex items-center w-full text-nowrap truncate overflow-hidden"
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
                  }).format(calculatePrice(item.veiculo.numEixos) || 0)}
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
                <span className="text-nowrap text-sm truncate overflow-hidden">
                  {item.veiculo.placa} - {item.veiculo.fabricante} -{" "}
                  {item.veiculo.modelo}
                </span>
              </div>
            ))}
          </div>
          <ScrollBar className="bg-ring rounded-xl" />
        </ScrollArea>
        <label className="text-lg" htmlFor="valor">
          Valor
        </label>
        <input
          onBlur={(e) => {
            setPrice(parseFloat(e.target.value));
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
          className="h-7 px-1 max-w-[150px] rounded-sm text-primary-foreground text-end"
        />
        <div className="flex mb-2 items-center">
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
        <label className="text-lg" htmlFor="date">
          Data
        </label>
        <input
          required
          value={`${Intl.DateTimeFormat("pt-br", { year: "numeric" }).format(
            date
          )}-${Intl.DateTimeFormat("pt-br", { month: "2-digit" }).format(
            date
          )}-${Intl.DateTimeFormat("pt-br", { day: "2-digit" }).format(date)}`}
          onChange={(e) => setDate(new Date(`${e.target.value}T12:00:00.000Z`))}
          name="date"
          type="date"
          className="w-[200px] px-1 text-primary-foreground h-7 rounded-sm mb-2"
        />
        <label className="me-2 text-lg" htmlFor="date-finished">
          Data de conclusão
        </label>
        <div className="flex items-center mb-2">
          <input
            required
            value={`${Intl.DateTimeFormat("pt-br", { year: "numeric" }).format(
              dateIsDone
            )}-${Intl.DateTimeFormat("pt-br", { month: "2-digit" }).format(
              dateIsDone
            )}-${Intl.DateTimeFormat("pt-br", { day: "2-digit" }).format(
              dateIsDone
            )}`}
            onChange={(e) =>
              setDateIsDone(new Date(`${e.target.value}T12:00:00.000Z`))
            }
            disabled={!isDone}
            name="date-finished"
            type="date"
            className="w-[200px] px-1 text-primary-foreground h-7 rounded-sm"
          />
          <input
            type="checkbox"
            defaultChecked={isDone}
            className="ms-1 me-1"
            onChange={(e) => setIsDone(e.target.checked)}
          />
          <p className="text-xs">Serviço concluído?</p>
        </div>
        <DialogFooter className="flex items-end">
          <Button onClick={createAtendimento} className="w-[100px]">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
