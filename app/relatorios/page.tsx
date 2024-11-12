"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { startTransition, useEffect, useState } from "react";
import moment from "moment";
import { GeneralTable } from "@/components/table";
import { getAllAgendamentos } from "../actions/get-agendamentos";
import { useSession } from "next-auth/react";
import { AgendamentoFull } from "../page";
import { DataTable } from "@/components/ui/data-table";
import { columnsAtendimentos } from "./_columns";

const Relatorios = () => {
  const { data }: { data: any } = useSession();
  const [atendimentos, setAtendimentos] = useState<AgendamentoFull[]>([]);
  const [filteredAtendimentos, setFilteredAtendimentos] = useState<
    AgendamentoFull[]
  >([]);
  const [initialDate, setInitialDate] = useState<any>(
    moment(Date.now()).format("YYYY-MM-DD")
  );
  const [finalDate, setFinalDate] = useState<any>(
    moment(Date.now()).format("YYYY-MM-DD")
  );

  useEffect(() => {
    data?.user &&
      startTransition(() => {
        getAllAgendamentos(data.user)
          .then((res) => {
            setAtendimentos(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }, [data]);

  const filterAtendimentos = () => {
    setTimeout(() => {
      setFilteredAtendimentos(() => {
        const newObj = atendimentos.filter(
          (agendamento) =>
            agendamento.serviceCompleted &&
            agendamento.serviceCompleted.setHours(20) >=
              new Date(initialDate).setHours(5) &&
            agendamento.serviceCompleted.setHours(5) <=
              new Date(finalDate).setHours(20)
        );
        return newObj;
      });
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
        {filteredAtendimentos.length > 0 && (
          <GeneralTable agendamentos={filteredAtendimentos} />
          //<DataTable
          //  data={filteredAtendimentos}
          //  columns={columnsAtendimentos}
          ///>
        )}
      </div>
    </div>
  );
};

export default Relatorios;
