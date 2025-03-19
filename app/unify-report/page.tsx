"use client";

import { Cliente } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getClienteById } from "../actions/get-clientes";
import { useSession } from "next-auth/react";

const UnifyReportPage = () => {
  const id = useSearchParams().get("cliente");
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    if (id && data) {
      getClienteById(parseInt(id), data?.user)
        .then((res) => {
          if (res) {
            setCliente(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, data]);
  return <></>;
};

export default UnifyReportPage;
