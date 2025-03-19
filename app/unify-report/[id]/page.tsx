"use client";

import { Prisma } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { getAllClientes, getClienteById } from "../../actions/get-clientes";
import { useSession } from "next-auth/react";

import { SearchCliente } from "../components/searchCliente";
import Loader from "@/components/loader";
import ListAgendamentos from "../components/listAgendamentos";

export type ClienteWithVeiculosAndAtendimentos = Prisma.ClienteGetPayload<{
  include: { veiculos: true; agendamentos: true };
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

  useEffect(() => {
    startTransition(() => {
      if (data) {
        getAllClientes(data.user).then((res) => {
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
      <div className="w-[50%] p-2">
        <SearchCliente clientes={clientes} selectedCliente={selectedCliente} />
        {selectedCliente && (
          <ListAgendamentos agendamentos={selectedCliente.agendamentos} />
        )}
      </div>
      {/* DIREITA */}
      <div className="w-[50%] bg-primary m-2 rounded-lg"></div>
    </div>
  );
};

export default UnifyReportPage;
