"use client";

import { Prisma } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getAllClientes, getClienteById } from "../actions/get-clientes";
import { useSession } from "next-auth/react";

import { SearchCliente } from "./components/searchCliente";
import Loader from "@/components/loader";

const UnifyReportPage = () => {
  const id = useSearchParams().get("cliente");
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const [clientes, setClientes] = useState<
    Prisma.ClienteGetPayload<{ include: { veiculos: true } }>[]
  >([]);
  const [selectedCliente, setSelectedCliente] =
    useState<Prisma.ClienteGetPayload<{ include: { veiculos: true } }> | null>(
      null
    );

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
        <SearchCliente
          clientes={clientes}
          selectedCliente={selectedCliente}
          setSelectedCliente={setSelectedCliente}
        />
      </div>
      {/* DIREITA */}
      <div className="w-[50%] bg-primary m-2 rounded-lg"></div>
    </div>
  );
};

export default UnifyReportPage;
