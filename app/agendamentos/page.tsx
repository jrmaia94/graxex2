"use client";

import Search from "@/components/search";
import { useEffect, useState, useTransition } from "react";
import { getAllAgendamentos } from "../actions/get-agendamentos";
import { toast } from "sonner";
import CardAgendamento from "@/components/card-agendamento";
import { CardAgendamentoProps } from "../page";
import Loader from "@/components/loader";

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<CardAgendamentoProps[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      getAllAgendamentos()
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
    });
  }, []);

  useEffect(() => {
    console.log(agendamentos);
  }, [agendamentos]);
  return (
    <div className="px-4">
      {isPending && <Loader />}
      <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
        Agendamentos
      </h2>
      <div className="mb-3">
        <Search origin="agendamentos" action={setAgendamentos} />
      </div>
      {agendamentos.map((agendamento) => (
        <CardAgendamento key={agendamento.id} agendamento={agendamento} />
      ))}
    </div>
  );
};

export default Agendamentos;
