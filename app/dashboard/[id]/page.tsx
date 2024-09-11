"use client";

import {
  Agendamento,
  AgendamentosPorVeiculos,
  Cliente,
  Veiculo,
} from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { getFullClienteById } from "../../actions/get-clientes";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/loader";
import CardVeiculo from "@/components/card-veiculo";
import CardCliente from "@/components/card-cliente";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, FileText } from "lucide-react";
import Image from "next/image";
import { createAgendamento } from "@/app/actions/post-agendamento";
import { DialogAgendamento } from "@/components/dialog-agendamento";
import { generate_PDF } from "@/app/actions/generate-PDF.js";

interface DashboardClienteProps {
  params: {
    id: string;
  };
}

interface AgendamentosPorVeiculosFull extends AgendamentosPorVeiculos {
  agendamento: Agendamento;
}

interface VeiculoFull extends Veiculo {
  agendamentos: AgendamentosPorVeiculosFull[];
}

interface ClienteFull extends Cliente {
  veiculos: VeiculoFull[];
  agendamentos: Agendamento[];
}

const DashboardCliente = ({ params }: DashboardClienteProps) => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [isPending, startTransition] = useTransition();

  const [cliente, setCliente] = useState<ClienteFull | null>(null);
  const [selectedVeiculos, setSelectedVeiculos] = useState<VeiculoFull[]>([]);
  const [selectedVeiculo, setSelectedVeiculo] = useState<VeiculoFull | null>(
    null
  );

  const [isDialogAgendamentoOpen, setIsDialogAgendamentoOpen] =
    useState<boolean>(false);

  const ultAgendamento = (veiculo: VeiculoFull) => {
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
        item.agendamento.serviceCompleted ? (wasDone = true) : (wasDone = false)
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

  useEffect(() => {
    if (data?.user && params.id) {
      startTransition(() => {
        getFullClienteById(parseInt(params.id), data.user)
          .then((res) => {
            setCliente(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Não foi possível buscar o cliente!");
          });
      });
    }
  }, [params, data]);

  return (
    <div className="flex flex-col p-4">
      {isPending && <Loader />}
      {cliente && (
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
                        ? setSelectedVeiculos(cliente.veiculos)
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
                <ScrollArea className="h-72">
                  <div className="flex w-full items-center">
                    <span className="text-xs w-[12%]">Frota</span>
                    <span className="text-xs w-[38%]">Veiculo</span>
                    <span className="text-xs w-[23%]">Placa</span>
                    <span className="text-xs w-[27%]">
                      Dias desde o ult. atendimento
                    </span>
                  </div>
                  {cliente.veiculos.map((veiculo) => (
                    <div
                      className={
                        selectedVeiculos.find((item) => item.id === veiculo.id)
                          ? "select-none transition-all bg-card-selected text-primary hover:cursor-pointer my-1 rounded-md px-1"
                          : "select-none transition-all hover:cursor-pointer my-1 rounded-md px-1 bg-slate-700"
                      }
                      key={veiculo.id}
                      onClick={() => setSelectedVeiculo(veiculo)}
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
                        {ultAgendamento(veiculo) === "Nunca foi atendido" ? (
                          <p className="text-xs py-2 text-red-400 font-bold w-[27%]">
                            {ultAgendamento(veiculo)}
                          </p>
                        ) : (
                          numDias(ultAgendamento(veiculo))
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            {/* Informação do veículo selecionado
            <Card className="w-full md:w-[30%]">
              <CardContent className="flex-col px-2 gap-2 w-full flex">
                <h2 className="mb-3 mt-1 text-sm font-bold text-ring">
                  Agendamentos do veículo
                </h2>
                {cliente.veiculos
                  .find((veiculo) => veiculo.id === selectedVeiculo?.id)
                  ?.agendamentos.map((item, index) => (
                    <p key={index}>
                      {Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(item.agendamento.date)}
                    </p>
                  ))}
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
                    onClick={() =>
                      generate_PDF({
                        ...cliente,
                        veiculos: [...selectedVeiculos],
                      })
                    }
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
                      <CardVeiculo veiculo={veiculo} />
                      <div className="w-full">
                        {" "}
                        {ultAgendamento(veiculo) === "Nunca foi atendido" ? (
                          <p className="text-xs py-2 text-red-400 font-bold">
                            {ultAgendamento(veiculo)}
                          </p>
                        ) : (
                          <div className="flex gap-3">
                            <p className="text-xs py-2 font-bold">
                              {ultAgendamento(veiculo)}
                            </p>
                            {numDias(ultAgendamento(veiculo))}
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
