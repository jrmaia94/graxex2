"use client";
import { getClienteById } from "@/app/actions/get-clientes";
import { Cliente } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ClientePageProps {
  params: {
    id: string;
  };
}

const ClientePage = ({ params }: ClientePageProps) => {
  const [cliente, setCliente] = useState<Cliente>();

  useEffect(() => {
    getClienteById(params.id)
      .then((res) => {
        if (!res) toast.info("Cliente não encontrado!");
        if (res) setCliente(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ocorreu um erro na buscar do cliente!");
      });
  }, [params]);
  return (
    <div>
      <h1>{cliente?.name || ""}</h1>
      <h1>{cliente?.phone || ""}</h1>
    </div>
  );
};

export default ClientePage;
