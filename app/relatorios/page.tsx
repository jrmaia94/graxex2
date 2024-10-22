"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataContext } from "@/providers/store";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { DataTable } from "@/components/table";

const Relatorios = () => {
  const { data } = useContext(DataContext);

  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<any>(
    moment(Date.now()).format("YYYY-MM-DD")
  );
  const [finalDate, setFinalDate] = useState<any>(
    moment(Date.now()).format("YYYY-MM-DD")
  );

  const filterAtendimentos = () => {
    setAtendimentos([]);
    setTimeout(() => {
      data &&
        setAtendimentos(
          data.agendamentos.filter(
            (agendamento) =>
              agendamento.serviceCompleted &&
              agendamento.serviceCompleted > new Date(initialDate)
          )
        );
    }, 500);
  };

  return (
    <div className="flex flex-col justify-center mt-[90px] p-2">
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
        {atendimentos.length > 0 && <DataTable agendamentos={atendimentos} />}
      </div>
    </div>
  );
};

export default Relatorios;
