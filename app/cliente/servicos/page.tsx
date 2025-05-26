"use client";
import { useSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { startTransition, useEffect, useState } from "react";
import { AgendamentoFull, ClienteFull } from "@/app/page";
import { getAgendamentoByCliente } from "@/app/actions/get-agendamentos";
import { toast } from "sonner";
import CardAgendamentoDoCliente from "../components/cardAgendamento";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSomeClientesById } from "@/app/actions/get-clientes";

interface Servico {
  clienteId: number;
  servicos: AgendamentoFull[];
}

const ServicosDoClientePage = () => {
  const { data }: { data: any } = useSession({ required: true });
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<ClienteFull[]>([]);

  function sortVeiculos(
    veiculos: Prisma.VeiculoGetPayload<{
      include: { agendamentos: { include: { agendamento: true } } };
    }>[]
  ) {
    return veiculos
      .map((veiculo) => {
        const lastAgendamento = veiculo.agendamentos
          .map(
            (item) => item.agendamento.serviceCompleted ?? item.agendamento.date
          )
          .sort((a, b) => {
            if (new Date(a) > new Date(b)) {
              return -1;
            }
            return 1;
          })[0];
        return {
          ...veiculo,
          lastAgendamento,
        };
      })
      .sort((a, b) => {
        if (new Date(a.lastAgendamento) > new Date(b.lastAgendamento)) {
          return 1;
        } else {
          return -1;
        }
      });
  }

  useEffect(() => {
    data?.user &&
      startTransition(() => {
        getAgendamentoByCliente(
          data.user.clientes.map((e: any) => e.clienteId),
          data.user
        )
          .then((res) => {
            setServicos(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ao buscar serviços!");
          });

        getSomeClientesById(
          data.user.clientes.map((e: any) => e.clienteId),
          data.user
        )
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ano buscar clientes!");
          });
      });
  }, [data]);
  return (
    <div className="mt-[90px] px-10">
      <section className="py-2 gap-1 flex flex-col">
        <div className="flex py-2 items-center rounded-md">
          <h1 className="text-lg">Serviços</h1>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full bg-white rounded-md"
        >
          {servicos.map((e) => {
            return (
              <AccordionItem key={e.clienteId} value={e.clienteId.toString()}>
                <AccordionTrigger className="text-primary-foreground px-4">
                  {clientes.find((i) => i.id === e.clienteId)?.name ?? ""}
                </AccordionTrigger>
                <AccordionContent className="gap-2 flex flex-col bg-primary-foreground pt-2">
                  {e.servicos.map((servico) => (
                    <CardAgendamentoDoCliente
                      agendamento={servico}
                      key={servico.id}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
    </div>
  );
};

export default ServicosDoClientePage;
