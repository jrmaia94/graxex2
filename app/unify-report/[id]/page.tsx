"use client";

import { Prisma } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { getAllClientesForUnifyReport } from "../../actions/get-clientes";
import { useSession } from "next-auth/react";

import { SearchCliente } from "../components/searchCliente";
import Loader from "@/components/loader";
import ListAgendamentos from "../components/listAgendamentos";
import ListVeiculos from "../components/listVeiculos";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ClienteWithVeiculosAndAtendimentos = Prisma.ClienteGetPayload<{
  include: {
    veiculos: true;
    agendamentos: { include: { veiculos: { include: { veiculo: true } } } };
  };
}>;

const UnifyReportPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const [clientes, setClientes] = useState<
    ClienteWithVeiculosAndAtendimentos[]
  >([]);
  const [selectedCliente, setSelectedCliente] =
    useState<ClienteWithVeiculosAndAtendimentos | null>(null);

  const [selectedAgendamentos, setSelectedAgendamentos] = useState<
    Prisma.AgendamentoGetPayload<{
      include: { veiculos: { include: { veiculo: true } } };
    }>[]
  >([]);

  useEffect(() => {
    startTransition(() => {
      if (data) {
        getAllClientesForUnifyReport(data.user).then((res) => {
          if (res) {
            setClientes(res);
          }
        });
      }
    });
  }, [data]);

  useEffect(() => {
    if (id) {
      const cliente = clientes.find((e) => e.id === parseInt(id));
      if (cliente) {
        setSelectedCliente(cliente);
      }
    }
  }, [id, clientes]);
  return (
    <div className="w-full h-screen flex pt-[90px]">
      {isPending && <Loader />}
      {/* ESQUERDA */}
      <div className="w-[50%] p-2 gap-2 flex flex-col">
        <SearchCliente clientes={clientes} selectedCliente={selectedCliente} />
        <ScrollArea className="h-72 bg-muted-foreground rounded-md p-2 py-0">
          {selectedCliente && (
            <ListAgendamentos
              setSelectedAgendamentos={setSelectedAgendamentos}
              agendamentos={selectedCliente.agendamentos}
            />
          )}
        </ScrollArea>
        {selectedAgendamentos.length > 0 && (
          <ListVeiculos selectedAgendamentos={selectedAgendamentos} />
        )}
      </div>
      {/* DIREITA */}
      <div className="w-[50%] bg-primary m-2 rounded-lg"></div>
    </div>
  );
};

export default UnifyReportPage;
