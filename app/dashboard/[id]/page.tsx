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
  const [timeHoldClick, setTimeHoldClick] = useState();

  const [cliente, setCliente] = useState<ClienteFull | null>(null);
  const [selectedVeiculos, setSelectedVeiculos] = useState<VeiculoFull[]>([]);
  const [selectedVeiculo, setSelectedVeiculo] = useState<VeiculoFull | null>(
    null
  );

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
        <div className="">
          <div>
            <CardCliente cliente={cliente} />
          </div>
          <div className="flex w-full flex-col gap-2 items-center sm:items-start sm:flex-row">
            {/* Lista com veículos */}
            <Card className="w-full sm:w-[40%]">
              <CardContent className="h-full flex flex-col px-2 gap-2 w-full min-w-[300px]">
                <h2 className="mb-3 mt-1 text-sm font-bold text-ring">
                  Veículos cadastrados
                </h2>
                <ScrollArea>
                  {cliente.veiculos.map((veiculo) => (
                    <div
                      className="hover:cursor-pointer"
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
                      <div className="block sm:hidden h-[200px]">
                        <p className="text-xs py-2">
                          {veiculo.fabricante} {veiculo.placa}
                        </p>
                      </div>
                      <div className="sm:block hidden">
                        <CardVeiculo veiculo={veiculo} />
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                {selectedVeiculo && (
                  <div className="block sm:hidden">
                    <CardVeiculo
                      veiculo={{
                        id: selectedVeiculo.id,
                        placa: selectedVeiculo.placa,
                        cor: selectedVeiculo.cor,
                        fabricante: selectedVeiculo.fabricante,
                        imageUrl: selectedVeiculo.imageUrl,
                        modelo: selectedVeiculo.modelo,
                        numEixos: selectedVeiculo.numEixos,
                        clienteId: selectedVeiculo.clienteId,
                        frota: selectedVeiculo.frota,
                        observacao: selectedVeiculo.observacao,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Informação do veículo selecionado */}
            <Card className="w-full sm:w-[30%]">
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
            <Card className="w-full sm:w-[30%] min-w-[300px]">
              <CardContent className="flex flex-col min-h-[300px] px-2 gap-2 w-full">
                <h2 className="mb-3 mt-1 text-sm font-bold text-ring">
                  Veículos para agendamento
                </h2>
                {selectedVeiculos.map((veiculo) => (
                  <div
                    className="hover:cursor-pointer"
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
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCliente;
