"use client";

import CardCliente from "@/components/card-cliente";
import Search from "@/components/search";
import { Cliente } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { getAllClientes } from "../actions/get-clientes";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { deleteClienteById } from "../actions/delete-clientes";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

const Clientes = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const router = useRouter();

  useEffect(() => {
    data?.user &&
      startTransition(() => {
        getAllClientes(data.user)
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ao buscar clientes!");
          });
      });
  }, [data]);
  return (
    <div className="px-4">
      {isPending && <Loader />}
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
                <Button
                  onClick={() => {
                    deleteClienteById(
                      parseInt(cliente.id.toString()),
                      data.user
                    )
                      .then((res) => {
                        toast.success(
                          `Cliente ${res.name} deletado com sucesso`
                        );
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      })
                      .catch((err) => {
                        console.log(err);
                        toast.error("Erro ao deletar cliente!");
                      });
                  }}
                  variant="ghost"
                  className="p-0 m-0 h-5"
                >
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
