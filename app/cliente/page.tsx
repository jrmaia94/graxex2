"use client";
import { useSession } from "next-auth/react";
import { startTransition, useEffect, useState } from "react";
import { AgendamentoFull, ClienteFull } from "../page";
import { toast } from "sonner";
import { getVeiculosByCLientes } from "../actions/get-veiculos";
import { Prisma } from "@prisma/client";
import { getSomeClientesById } from "../actions/get-clientes";
import CardVeiculo from "./components/cardVeiculo";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import CardAgendamentoDoCliente from "./components/cardAgendamento";
import { getAgendamentoByCliente } from "../actions/get-agendamentos";
import { Badge } from "@/components/ui/badge";

interface Veiculo {
  clienteId: number;
  veiculos: Prisma.VeiculoGetPayload<{
    include: { agendamentos: { include: { agendamento: true } } };
  }>[];
}

interface Servico {
  clienteId: number;
  servicos: AgendamentoFull[];
}

const TelaCliente = () => {
  const { data }: { data: any } = useSession({ required: true });
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<ClienteFull[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

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
            toast.error("Erro ano buscar veiculos!");
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
      });
  }, [data]);

  return (
    <div className="mt-[90px] px-10">
      <section className="py-2 gap-1 flex flex-col items-center">
        <div className="w-full gap-1 flex flex-col">
          <div className="flex py-2 items-center rounded-md">
            <Link href={"/cliente/veiculos"} className="flex items-center">
              <h1 className="text-lg">Veiculos</h1>
              <ChevronRightIcon />
            </Link>
          </div>
          {veiculos.length > 0 &&
            veiculos.map((item) => {
              return sortVeiculos(item.veiculos)
                .slice(0, 4)
                .map((veiculo) => {
                  return (
                    <CardVeiculo
                      key={veiculo.id}
                      veiculo={veiculo}
                      cliente={clientes.find((e) => e.id === item.clienteId)}
                    />
                  );
                });
            })}
        </div>
        <Link href={"/cliente/veiculos"}>
          <Badge className="max-w-[200px] flex justify-center">
            + ver mais
          </Badge>
        </Link>
      </section>
      <section className="py-2 gap-1 flex flex-col items-center">
        <div className="w-full gap-1 flex flex-col">
          <div className="flex py-2 items-center rounded-md">
            <Link href={"/cliente/servicos"} className="flex items-center">
              <h1 className="text-lg">Serviços</h1>
              <ChevronRightIcon />
            </Link>
          </div>
          {servicos.map((e) => {
            return e.servicos
              .slice(0, 4)
              .map((servico) => (
                <CardAgendamentoDoCliente
                  agendamento={servico}
                  key={servico.id}
                />
              ));
          })}
        </div>
        <Link href={"/cliente/servicos"}>
          <Badge className="max-w-[200px] flex justify-center">
            + ver mais
          </Badge>
        </Link>
      </section>
    </div>
  );
};

export default TelaCliente;
