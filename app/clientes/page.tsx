"use client";

import CardCliente from "@/components/card-cliente";
import Search from "@/components/search";
import { Cliente } from "@prisma/client";
import { useEffect, useState } from "react";
import { getAllClientes } from "../actions/get-clientes";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const { data }: { data: any } = useSession({
    required: true,
  });

  useEffect(() => {
    getAllClientes()
      .then((res) => {
        setClientes(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ao buscar clientes!");
      });
  }, []);
  return (
    <div className="px-4">
      <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
        Clientes
      </h2>
      <div className="mb-3">
        <Search origin="clientes" action={setClientes} />
      </div>
      <div className="flex flex-col gap-1">
        {clientes?.map((cliente) => (
          <Card key={cliente.id}>
            <CardContent className="p-2 flex justify-between">
              <CardCliente cliente={cliente} />
              <div className="flex flex-col justify-center gap-5 px-4">
                <Link href={`/clientes/${cliente.id}`} className="p-0 m-0">
                  <Edit size={20} />
                </Link>
                <Button variant="ghost" className="p-0 m-0 h-5">
                  <Trash2Icon size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clientes;
