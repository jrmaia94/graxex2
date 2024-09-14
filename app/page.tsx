"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState, useTransition } from "react";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import CardAgendamentoFinalizado from "@/components/card-agendamento-finalizado";
import Loader from "@/components/loader";
import { DataContext } from "@/providers/store";

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
  const { data: dados } = useContext(DataContext);

  /*   useEffect(() => {
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
  }, [data]); */

  useEffect(() => {
    if (dados) {
      if (dados.agendamentos) {
        startTransition(() => {
          setAgendamentosFinalizados((array: any) => {
            let newArray = [...array];
            newArray = [
              ...dados.agendamentos.filter((item) => item.serviceCompleted),
            ];
            return newArray;
          });
        });
      }
    }
  }, [dados]);

  return (
    <div className="flex justify-center mt-[90px]">
      <div className="w-full max-w-[920px] flex flex-col items-center relative">
        {isPending && <Loader />}
        {/*         <div
          className="
          absolute
          opacity-40
          rounded-full
          top-[-150px]
          right-0
          flex
          align-bottom
          overflow-hidden
          w-[250px]
          h-[450px]"
        >
          <Image
            alt="Foto graxex"
            src="/background.jpeg"
            className="object-none "
            width={600}
            height={600}
          />
        </div> */}
        <div className="px-4 w-full max-w-[600px]">
          {/*           <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
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
          </ScrollArea> */}
          <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
            Pre-Agendamentos
          </h2>
          <ScrollArea className="h-[600px] whitespace-nowrap">
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
