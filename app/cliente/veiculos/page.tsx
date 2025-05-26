"use client";
import { useSession } from "next-auth/react";
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { Prisma } from "@prisma/client";
import { ClienteFull } from "@/app/page";
import { getVeiculosByCLientes } from "@/app/actions/get-veiculos";
import { getSomeClientesById } from "@/app/actions/get-clientes";
import CardVeiculo from "../components/cardVeiculo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Veiculo {
  clienteId: number;
  veiculos: Prisma.VeiculoGetPayload<{
    include: { agendamentos: { include: { agendamento: true } } };
  }>[];
}

const VeiculosDoCliente = () => {
  const { data }: { data: any } = useSession({ required: true });
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
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
        getVeiculosByCLientes(
          data.user.clientes.map((e: any) => e.clienteId),
          data.user
        )
          .then((res) => {
            setVeiculos(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ao buscar veiculos!");
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
          <h1 className="text-lg">Veiculos</h1>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full bg-white rounded-md"
        >
          {veiculos.length > 0 &&
            veiculos.map((item) => {
              return (
                <AccordionItem
                  key={item.clienteId}
                  value={item.clienteId.toString()}
                >
                  <AccordionTrigger className="text-primary-foreground px-4">
                    {clientes.find((i) => i.id === item.clienteId)?.name ?? ""}
                  </AccordionTrigger>
                  <AccordionContent className="gap-2 flex flex-col bg-primary-foreground pt-2">
                    {sortVeiculos(item.veiculos).map((veiculo) => {
                      return (
                        <CardVeiculo
                          key={veiculo.id}
                          veiculo={veiculo}
                          cliente={clientes.find(
                            (e) => e.id === item.clienteId
                          )}
                        />
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      </section>
    </div>
  );
};

export default VeiculosDoCliente;
