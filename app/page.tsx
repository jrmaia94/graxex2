"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import {
  getAgendamentosFinalizados,
  getAgendamentosFuturos,
} from "./actions/get-agendamentos";
import { toast } from "sonner";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import CardAgendamento from "@/components/card-agendamento";
import CardAgendamentoFinalizado from "@/components/card-agendamento-finalizado";
import Loader from "@/components/loader";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

interface AgendamentoProps extends Agendamento {
  cliente: ClienteFull;
  veiculos: Veiculo[];
}

const Home = () => {
  const {} = useTransition();
  const [isPending, startTransition] = useTransition();
  const [agendamentosFuturos, setAgendamentosFuturos] = useState<
    AgendamentoProps[]
  >([]);
  const [agendamentosFinalizados, setAgendamentosFinalizados] = useState<
    AgendamentoProps[]
  >([]);
  const { data }: { data: any } = useSession({
    required: true,
  });

  useEffect(() => {
    data?.user &&
      startTransition(() => {
        getAgendamentosFuturos(data.user)
          .then((res) => {
            const newObj = res.map((e) => {
              return {
                ...e,
                veiculos: e.veiculos.map((veiculo) => veiculo.veiculo),
              };
            });
            setAgendamentosFuturos(newObj);
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              `Não foi possível carregar os agendamentos! ${err.message}`
            );
          });

        getAgendamentosFinalizados(data.user)
          .then((res) => {
            const newObj = res.map((e) => {
              return {
                ...e,
                veiculos: e.veiculos.map((veiculo) => veiculo.veiculo),
              };
            });
            setAgendamentosFinalizados(newObj);
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              `Não foi possível carregar os agendamentos! ${err.message}`
            );
          });
      });
  }, [data]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[920px] flex flex-col items-center">
        {isPending && <Loader />}
        <Image
          alt="Foto graxex"
          src="/background.jpeg"
          className="max-h-[300px] w-full object-cover opacity-80"
          height={1000}
          width={1000}
        />
        <div className="px-4 w-full max-w-[600px]">
          <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
            Agendamentos
          </h2>
          <ScrollArea className="h-72 whitespace-nowrap">
            {agendamentosFuturos.map((agendamento) => {
              return (
                <div className="pb-2" key={agendamento.id}>
                  <CardAgendamento agendamento={agendamento} />
                </div>
              );
            })}
            <ScrollBar className="bg-ring rounded-xl" />
          </ScrollArea>
          <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
            Pre-Agendamentos
          </h2>
          <ScrollArea className="h-72 whitespace-nowrap">
            {agendamentosFinalizados.map((agendamento) => {
              return (
                <div className="pb-2" key={agendamento.id}>
                  <CardAgendamentoFinalizado agendamento={agendamento} />
                </div>
              );
            })}
            <ScrollBar className="bg-ring rounded-xl" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Home;
