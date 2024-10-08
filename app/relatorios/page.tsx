"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataContext } from "@/providers/store";
import { useContext, useEffect, useState } from "react";

const Relatorios = () => {
  const { data } = useContext(DataContext);

  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<any>();
  const [finalDate, setFinalDate] = useState<any>();

  const filterAtendimentos = () => {
    data &&
      setAtendimentos(
        data.agendamentos.filter(
          (agendamento) =>
            agendamento.serviceCompleted &&
            agendamento.serviceCompleted > new Date(initialDate)
        )
      );
  };

  return (
    <div className="flex flex-col justify-center mt-[90px] py-2">
      <div className="flex flex-col items-start md:items-center gap-1 md:gap-2 md:flex-row">
        <span className="text-nowrap">Selecione um intervalo</span>
        <div className="flex items-center gap-2">
          <Input
            value={initialDate}
            onChange={(e) => setInitialDate(e.target.value)}
            type="date"
            className="bg-primary text-primary-foreground"
          />
          <span>à</span>
          <Input
            value={finalDate}
            onChange={(e) => setFinalDate(e.target.value)}
            type="date"
            className="bg-primary text-primary-foreground"
          />
        </div>
        <Button onClick={() => filterAtendimentos()} disabled={!data}>
          Buscar
        </Button>
      </div>
      <div className="flex flex-col">
        {atendimentos.map((atendimento) => {
          console.log(atendimento);
          return <p key={atendimento.id}>{atendimento.clienteId}</p>;
        })}
      </div>
    </div>
  );
};

export default Relatorios;
