"use client";

import { Agendamento, AgendamentosPorVeiculos, Veiculo } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/loader";
import CardVeiculo from "@/components/card-veiculo";
import CardCliente from "@/components/card-cliente";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, FileText } from "lucide-react";
import Image from "next/image";
import { DialogAgendamento } from "@/components/dialog-agendamento";
import { generate_PDF } from "@/app/actions/generate-PDF.js";
import { ClienteFull, DataContext, VeiculoFull } from "@/providers/store";
import { Input } from "@/components/ui/input";

interface DashboardClienteProps {
  params: {
    id: string;
  };
}

const DashboardCliente = ({ params }: DashboardClienteProps) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const { data: dados } = useContext(DataContext);

  const [isPending, startTransition] = useTransition();

  const [cliente, setCliente] = useState<ClienteFull | null>(null);
  const [veiculos, setVeiculos] = useState<VeiculoFull[]>([]);
  const [selectedVeiculos, setSelectedVeiculos] = useState<VeiculoFull[]>([]);

  const [isDialogAgendamentoOpen, setIsDialogAgendamentoOpen] =
    useState<boolean>(false);

  const ultAgendamento = (veiculo: VeiculoFull | undefined) => {
    if (veiculo) {
      if (veiculo.agendamentos.length === 0) {
        return "Nunca foi atendido";
      } else if (veiculo.agendamentos.length === 1) {
        return veiculo.agendamentos[0].agendamento.serviceCompleted
          ? Intl.DateTimeFormat("pt-br", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(veiculo.agendamentos[0].agendamento.serviceCompleted)
          : "Nunca foi atendido";
      } else if (veiculo.agendamentos.length > 1) {
        let wasDone = false;
        veiculo.agendamentos.forEach((item) =>
          item.agendamento.serviceCompleted
            ? (wasDone = true)
            : (wasDone = false)
        );
        if (wasDone) {
          return Intl.DateTimeFormat("pt-br", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(
            veiculo.agendamentos
              .sort((a, b) => {
                let value1 = a.agendamento.serviceCompleted?.getTime() || 0;
                let value2 = b.agendamento.serviceCompleted?.getTime() || 0;
                return value2 - value1;
              })[0]
              .agendamento.serviceCompleted?.getTime()
          );
        } else {
          return "Nunca foi atendido";
        }
      }
    }
  };

  const diffBetweenDates = (date: Date | string | undefined) => {
    if (date) {
      let today = new Date(Date.now()).getTime();
      let dateConfigure = new Date(
        `${date.toString().substring(6)}/
          ${date.toString().substring(3, 5)}/
          ${date.toString().substring(0, 2)}`
      );
      return Math.round(
        (today - dateConfigure.getTime()) / 1000 / 60 / 60 / 24
      );
    } else {
      return -1;
    }
  };

  const numDias = (date: Date | string | undefined) => {
    if (date) {
      let num = diffBetweenDates(date);
      if (num === 0) {
        return <p className="text-xs w-[27%] py-2">{num} dias</p>;
      } else if (num === 1) {
        return <p className="text-xs w-[27%] py-2">{num} dias</p>;
      } else if (num > 1 && num < 25) {
        return <p className="text-xs w-[27%] py-2">{num} dias</p>;
      } else if (num >= 25) {
        return <p className="text-xs w-[27%] py-2 text-red-400">{num} dias</p>;
      }
    } else {
      return "";
    }
  };

  const sortArrayVeiculos = (veiculos: VeiculoFull[]) => {
    return veiculos.sort((a: any, b: any) => {
      if (a.placa > b.placa) {
        return 1;
      } else if (a.placa < b.placa) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  useEffect(() => {
    if (dados && dados.clientes && data) {
      if (data?.user && params.id) {
        startTransition(() => {
          let localCliente = dados.clientes.find(
            (item) => item.id === parseInt(params.id.toString())
          );
          localCliente
            ? setCliente(localCliente)
            : toast.error(
                `Não foi possível buscar o cliente com id ${params.id}!`
              );

          let localVeiculos = sortArrayVeiculos(
            dados.veiculos.filter(
              (item) => item.clienteId === parseInt(params.id.toString())
            )
          );
          localVeiculos
            ? setVeiculos(localVeiculos)
            : toast.error(
                `Não foi possível encontrar os veiculos do cliente com id ${params.id}!`
              );
          /* getFullClienteById(parseInt(params.id), data.user)
            .then((res) => {
              setCliente(res);
            })
            .catch((err) => {
              console.log(err);
            }); */
        });
      }
    }
  }, [params, data, dados]);

  return (
    <div className="flex flex-col p-4 mt-[90px]">
      {isPending && <Loader />}
      {dados && cliente && (
        <div className="w-full flex flex-col md:items-center">
          <div className="md:max-w-[864px] md:w-full">
            <CardCliente cliente={cliente} />
          </div>
          <div className="flex flex-col gap-2 md:max-w-[864px] md:w-full items-center md:items-start md:flex-row">
            {/* Lista com veículos */}
            <Card className="w-full md:w-[57%] print:hidden">
              <CardContent className="h-full flex flex-col px-2 gap-2 w-full min-w-[300px] relative">
                <div className="flex items-center justify-center absolute right-0 py-1 px-2 gap-1">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      e.target.checked
                        ? setSelectedVeiculos(veiculos)
                        : setSelectedVeiculos([]);
                    }}
                  />
                  <p className="text-xs italic">marcar todos</p>
                </div>
                <h2 className="mb-3 mt-1 text-sm font-bold text-ring">
                  Veículos cadastrados{" "}
                  <span className="italic text-xs text-clip font-normal">
                    --{cliente.veiculos.length} veículo(s)--
                  </span>
                </h2>
                <div>
                  <div className="flex w-full items-center">
                    <span className="text-xs w-[12%]">Frota</span>
                    <span className="text-xs w-[38%]">Veiculo</span>
                    <span className="text-xs w-[23%]">Placa</span>
                    <span className="text-xs w-[27%]">
                      Dias desde o ult. atendimento
                    </span>
                  </div>
                  <Input
                    className="bg-primary border-none h-8 w-[50%] text-primary-foreground"
                    placeholder="Buscar veículo"
                    onChange={(e) => {
                      let localVeiculos =
                        dados &&
                        dados.veiculos.filter(
                          (item) =>
                            item.clienteId === parseInt(params.id.toString())
                        );

                      if (localVeiculos) {
                        localVeiculos = localVeiculos.filter((item) => {
                          if (
                            item.placa
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase()) ||
                            item.fabricante
                              ?.toLowerCase()
                              .includes(e.target.value.toLowerCase()) ||
                            item.modelo
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase()) ||
                            item.frota
                              ?.toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          ) {
                            return item;
                          }
                        });
                        setVeiculos(localVeiculos);
                      }
                    }}
                  />
                </div>
                <ScrollArea className="h-72">
                  {veiculos?.map((veiculo) => (
                    <div
                      className={
                        selectedVeiculos?.find((item) => item.id === veiculo.id)
                          ? "select-none transition-all bg-card-selected text-primary hover:cursor-pointer my-1 rounded-md px-1"
                          : "select-none transition-all hover:cursor-pointer my-1 rounded-md px-1 bg-slate-700"
                      }
                      key={veiculo.id}
                      onDoubleClick={() =>
                        setSelectedVeiculos((array) => {
                          const newArray = [...array];
                          if (
                            !newArray.find((item) => item.id === veiculo.id)
                          ) {
                            newArray.push(veiculo);
                          }
                          return newArray;
                        })
                      }
                    >
                      <div className="flex gap-2 w-full items-center">
                        <p className="text-xs py-2 w-[12%]">{veiculo.frota}</p>
                        <p className="text-xs py-2 w-[38%]">
                          {veiculo.modelo?.toUpperCase()}
                        </p>
                        <p className="text-xs py-2 w-[23%]">{veiculo.placa}</p>
                        {ultAgendamento(
                          dados?.veiculos.find((item) => item.id === veiculo.id)
                        ) === "Nunca foi atendido" ? (
                          <p className="text-xs py-2 text-red-400 font-bold w-[27%]">
                            {ultAgendamento(
                              dados?.veiculos.find(
                                (item) => item.id === veiculo.id
                              )
                            )}
                          </p>
                        ) : (
                          numDias(
                            ultAgendamento(
                              dados?.veiculos.find(
                                (item) => item.id === veiculo.id
                              )
                            )
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            {/* Veículos selecionados */}
            <Card className="w-full md:w-[43%]">
              <CardContent className="flex flex-col min-h-[300px] px-2 gap-2 w-full relative">
                <div className="flex absolute right-0 p-1 gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    className="rounded-full bg-transparent"
                    onClick={() => {
                      generate_PDF({
                        ...cliente,
                        veiculos: [...selectedVeiculos],
                      });
                    }}
                  >
                    <Image
                      alt="Icon PDF"
                      src="/pdf_icon.svg"
                      width={20}
                      height={20}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="rounded-full bg-transparent"
                    onClick={() => setIsDialogAgendamentoOpen(true)}
                  >
                    <CircleCheckBig />
                  </Button>
                  <DialogAgendamento
                    setIsOpen={setIsDialogAgendamentoOpen}
                    isOpen={isDialogAgendamentoOpen}
                    cliente={cliente}
                    veiculos={selectedVeiculos}
                  />
                </div>
                <h2 className="mb-3 mt-1 text-sm font-bold text-ring">
                  Veículos para atendimento
                </h2>
                <ScrollArea className="h-72">
                  {selectedVeiculos.map((veiculo) => (
                    <div
                      className="select-none hover:cursor-pointer bg-card-selected rounded-md mb-1 px-2"
                      key={veiculo.id}
                      onDoubleClick={() =>
                        setSelectedVeiculos((array) => {
                          const newArray = [...array];
                          return newArray.filter(
                            (item) => item.id !== veiculo.id
                          );
                        })
                      }
                    >
                      <CardVeiculo
                        veiculo={dados?.veiculos.find(
                          (item) => item.id === veiculo.id
                        )}
                      />
                      <div className="w-full">
                        {" "}
                        {ultAgendamento(
                          dados?.veiculos.find((item) => item.id === veiculo.id)
                        ) === "Nunca foi atendido" ? (
                          <p className="text-xs py-2 text-red-400 font-bold">
                            {ultAgendamento(
                              dados?.veiculos.find(
                                (item) => item.id === veiculo.id
                              )
                            )}
                          </p>
                        ) : (
                          <div className="flex gap-3">
                            <p className="text-xs py-2 font-bold">
                              {ultAgendamento(
                                dados?.veiculos.find(
                                  (item) => item.id === veiculo.id
                                )
                              )}
                            </p>
                            {numDias(
                              ultAgendamento(
                                dados?.veiculos.find(
                                  (item) => item.id === veiculo.id
                                )
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCliente;
