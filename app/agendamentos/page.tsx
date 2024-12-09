"use client";

import Search from "@/components/search";
import { useEffect, useState, useTransition } from "react";
import CardAgendamento from "@/components/card-agendamento";
import Loader from "@/components/loader";
import { useSession } from "next-auth/react";
import { AgendamentoFull } from "../page";
import { getAllAgendamentos } from "../actions/get-agendamentos";

const Agendamentos = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [agendamentos, setAgendamentos] = useState<AgendamentoFull[]>([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState<
    AgendamentoFull[]
  >([]);
  const [isPending, startTransition] = useTransition();

  /*   useEffect(() => {
    startTransition(() => {
      if (loadAllAgendamentos) {
        data?.user &&
          getAllAgendamentos(data.user)
            .then((res) => {
              const newObj = res.map((e) => {
                return {
                  ...e,
                  veiculos: e.veiculos.map((veiculo) => veiculo.veiculo),
                };
              });
              setAgendamentos(newObj);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Erro ao buscar os agendamentos!");
            });
      } else {
        data?.user &&
          getAgendamentosFuturos(data.user)
            .then((res) => {
              const newObj = res.map((e) => {
                return {
                  ...e,
                  veiculos: e.veiculos.map((veiculo) => veiculo.veiculo),
                };
              });
              setAgendamentos(newObj);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Erro ao buscar os agendamentos!");
            });
      }
    });
  }, [loadAllAgendamentos, data]); */

  useEffect(() => {
    setFilteredAgendamentos(agendamentos);
  }, [agendamentos]);

  useEffect(() => {
    if (data?.user) {
      startTransition(() => {
        getAllAgendamentos(data.user)
          .then((res) => {
            setAgendamentos(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, [data]);
  return (
    <div className="flex justify-center mt-[90px]">
      {isPending && <Loader />}
      <div className="px-4 w-full max-w-[600px]">
        <div className="w-full left-0 top-[90px] px-4 z-10 bg-gray-800/[.97] fixed flex flex-col">
          <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
            Agendamentos
          </h2>
          <div className="mb-3 flex w-full gap-2">
            <Search
              origin="agendamentos"
              state={agendamentos}
              action={setFilteredAgendamentos}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[120px]">
          {filteredAgendamentos.map((agendamento) => (
            <CardAgendamento key={agendamento.id} agendamento={agendamento} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;
