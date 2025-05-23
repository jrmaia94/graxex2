"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import Loader from "@/components/loader";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CardCliente from "@/components/card-cliente";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import { getAllClientes } from "./actions/get-clientes";
import { getAllAgendamentos } from "./actions/get-agendamentos";

export interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
  agendamentos: Agendamento[];
}

export interface ClienteWVeiculo extends Cliente {
  veiculos: Veiculo[];
}

export interface VeiculoFull extends Veiculo {
  cliente: Cliente;
  agendamentos: {
    veiculoId: number;
    agendamentoId: number;
    agendamento: Agendamento;
  }[];
}

export interface VeiculoWCliente extends Veiculo {
  cliente: Cliente;
}

export interface AgendamentoFull extends Agendamento {
  cliente: ClienteWVeiculo;
  veiculos: {
    veiculoId: number;
    agendamentoId: number;
    veiculo: VeiculoWCliente;
  }[];
}

const Home = () => {
  const [isPending, startTransition] = useTransition();
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [clientes, setClientes] = useState<ClienteFull[]>();
  const [agendamentos, setAgendamentos] = useState<AgendamentoFull[]>();

  useEffect(() => {
    data?.user &&
      startTransition(() => {
        getAllClientes(data.user)
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
          });

        getAllAgendamentos(data.user)
          .then((res) => {
            setAgendamentos(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }, [data]);

  const handleSortOfLastService = (cliente: ClienteFull) => {
    interface LastService {
      veiculo: Veiculo;
      ultAtendimento: Date | null;
    }

    let veiculosWithLastServices: LastService[] = [];

    cliente.veiculos.forEach((veiculo) => {
      let lastService = agendamentos
        ?.filter(
          (agendamento) =>
            agendamento.clienteId === cliente.id &&
            agendamento.veiculos.map((i) => i.veiculoId).includes(veiculo.id)
        )
        .sort(
          (a: any, b: any) => b.serviceCompleted - a.serviceCompleted
        )[0]?.serviceCompleted;

      const ciclo = veiculo.ciclo || cliente.ciclo || 25;

      if (
        lastService &&
        Math.round((Date.now() - lastService.getTime()) / 1000 / 60 / 60 / 24) >
          ciclo
      ) {
        veiculosWithLastServices.push({
          veiculo: veiculo,
          ultAtendimento: lastService || null,
        });
      }
    });

    veiculosWithLastServices.sort(
      (a: any, b: any) => a.ultAtendimento - b.ultAtendimento
    );

    return veiculosWithLastServices;
  };

  /* useEffect(() => {
    agendamentos &&
      generate_PDF_recibo(
        agendamentos.find((e) => e.cliente.address !== null)
      );
  }, [agendamentos]); */

  return (
    <div className="flex justify-center mt-[90px]">
      {isPending && <Loader />}
      <div className="w-full px-10 max-w-[920px] mx-auto flex flex-wrap justify-center relative gap-2">
        {clientes?.map((cliente) => {
          if (handleSortOfLastService(cliente).length > 0) {
            return (
              <Dialog key={cliente.id}>
                <DialogTrigger asChild>
                  <Button className="w-[150px] h-[80px] overflow-clip whitespace-normal text-lg">
                    {cliente.name}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <CardCliente cliente={cliente} />
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-64 w-full">
                    <div className="flex flex-col gap-2">
                      {handleSortOfLastService(cliente).map(
                        ({ veiculo, ultAtendimento }) => (
                          <div
                            key={veiculo.id}
                            className="flex flex-col p-2 bg-slate-600 rounded-sm "
                          >
                            <div className="gap-3 flex">
                              <span>{veiculo.frota}</span>
                              <span>{veiculo.placa}</span>
                              <span>{veiculo.fabricante}</span>
                              <span>{veiculo.modelo}</span>
                              {veiculo.phoneMotorista && (
                                <span>
                                  <Link
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        veiculo.phoneMotorista || ""
                                      )
                                    }
                                    href={`https://wa.me//${veiculo.phoneMotorista
                                      ?.toString()
                                      .replace(
                                        /\D/g,
                                        ""
                                      )}?text=Bom%20dia!%20Vamos%20engraxar%20hoje?`}
                                    target="_blank"
                                    className="flex gap-1"
                                  >
                                    <Image
                                      className="rounded-full"
                                      alt="Ícone Whatsapp"
                                      src="/wpp-icon.svg"
                                      width={15}
                                      height={15}
                                    />
                                    <p className="text-ring text-sm">
                                      {veiculo.nomeMotorista}
                                    </p>
                                  </Link>
                                </span>
                              )}
                            </div>
                            {ultAtendimento ? (
                              <div className="gap-2 flex italic text-red-300">
                                <span>Ult. Atend. em</span>
                                <span>
                                  {Intl.DateTimeFormat("pt-br", {
                                    dateStyle: "short",
                                  }).format(ultAtendimento)}
                                </span>
                                <span>à</span>
                                <span>
                                  {`${Math.round(
                                    (new Date(Date.now()).setHours(6) -
                                      (ultAtendimento.setHours(6) || 0)) /
                                      1000 /
                                      60 /
                                      60 /
                                      24
                                  )} dia(s)`}
                                </span>
                              </div>
                            ) : (
                              <div className="gap-2 flex italic text-red-300">
                                <span>Nunca foi atendido</span>
                              </div>
                            )}
                          </div>
                        )
                      )}
                      {/*                   {cliente.veiculos.map((veiculo) => (
                      <div
                        key={veiculo.id}
                        className="flex flex-col p-2 bg-slate-600 rounded-sm "
                      >
                        <div className="gap-3 flex">
                          <span>{veiculo.frota}</span>
                          <span>{veiculo.placa}</span>
                          <span>{veiculo.fabricante}</span>
                          <span>{veiculo.modelo}</span>
                        </div>
                        <div className="gap-2 flex italic text-red-300">
                          <span>Ult. Atend. em</span>
                          <span>
                            {Intl.DateTimeFormat("pt-br", {
                              dateStyle: "short",
                            }).format(
                              dados?.agendamentos
                                .find(
                                  (e) =>
                                    e.clienteId === cliente.id &&
                                    e.veiculos
                                      .map((i) => i.veiculoId)
                                      .includes(veiculo.id)
                                )
                                ?.date.getTime()
                            )}
                          </span>
                          <span>à</span>
                          <span>
                            {Math.round(
                              (new Date(Date.now()).setHours(6) -
                                (dados?.agendamentos
                                  .find(
                                    (e) =>
                                      e.clienteId === cliente.id &&
                                      e.veiculos
                                        .map((i) => i.veiculoId)
                                        .includes(veiculo.id)
                                  )
                                  ?.date.setHours(6) || 0)) /
                                1000 /
                                60 /
                                60 /
                                24
                            )}{" "}
                            dia(s)
                          </span>
                        </div>
                      </div>
                    ))} */}
                      <ScrollBar orientation="vertical" />
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Home;
