"use client";

import Search from "@/components/search";
import { useEffect, useState, useTransition } from "react";
import CardAgendamento from "@/components/card-agendamento";
import Loader from "@/components/loader";
import { useSession } from "next-auth/react";
import { AgendamentoFull } from "../page";
import { getAllAgendamentos } from "../actions/get-agendamentos";
import {
  groupAgendamentosByClient,
  GroupedAgendamentos,
} from "@/lib/groupAgendamentos";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const Agendamentos = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [agendamentos, setAgendamentos] = useState<AgendamentoFull[]>([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState<
    GroupedAgendamentos[]
  >([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFilteredAgendamentos(() => groupAgendamentosByClient(agendamentos));
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
    <div className="flex justify-center mt-[130px]">
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
          <Accordion type="single" collapsible>
            {filteredAgendamentos.map((item) => (
              <AccordionItem
                key={item.cliente.id}
                value={item.cliente.id.toString()}
                className={cn(
                  "bg-primary text-primary-foreground rounded-t-lg",
                  item.agendamentos.find((e) => e.paid === false) &&
                    "bg-red-200"
                )}
              >
                <AccordionTrigger
                  className={cn(
                    item.agendamentos.find((e) => e.paid === false) &&
                      "text-red-800",
                    "px-2"
                  )}
                >
                  <div className="flex w-full justify-between items-center pr-4">
                    <span className="text-lg">{item.cliente.name}</span>
                    <div className="flex gap-2 text-primary-foreground">
                      <div className="flex flex-col gap-1 text-xs items-end">
                        <span>Nº atend</span>
                        <span className="text-red-800">Não pagos</span>
                        <span>Ult. atend</span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs items-end">
                        <span>{item.agendamentos.length}</span>
                        <span className="text-red-800">
                          {item.agendamentos.filter((e) => !e.paid).length}
                        </span>
                        <span>
                          {Intl.DateTimeFormat("pt-BR", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                          }).format(item.agendamentos[0].date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-2">
                  {item.agendamentos.map((agendamento) => (
                    <CardAgendamento
                      key={agendamento.id}
                      agendamento={agendamento}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;
