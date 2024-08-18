"use client";

import { getAgendamentoById } from "@/app/actions/get-agendamentos";
import { Agendamento } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PageAgendamentoProps {
  params: {
    id: string;
  };
}

const AgendamentoPage = ({ params }: PageAgendamentoProps) => {
  const [agendamento, setAgendamento] = useState<Agendamento>();

  useEffect(() => {
    console.log(params);
    params.id !== "create" &&
      getAgendamentoById(parseInt(params.id))
        .then((res) => {
          if (!res) toast.info("Cliente não encontrado!");
          if (res) {
            const newObj = {
              ...res,
              veiculos: res?.veiculos.map((e) => e.veiculo),
            };
            setAgendamento(newObj);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Não foi possível buscar os agendamentos!");
        });
  }, [params]);

  useEffect(() => {
    console.log(agendamento);
  }, [agendamento]);
  return <></>;
};

export default AgendamentoPage;
