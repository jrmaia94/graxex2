"use client";

import CardCliente from "@/components/card-cliente";
import Search from "@/components/search";
import { Cliente, Veiculo } from "@prisma/client";
import { useContext, useEffect, useState, useTransition } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataContext } from "@/providers/store";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

const Clientes = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const { data: dados, setData } = useContext(DataContext);
  const [isPending, startTransition] = useTransition();
  const [clientes, setClientes] = useState<ClienteFull[]>([]);

  function deleteCliente(id: number) {
    deleteClienteById(id, data.user)
      .then((res) => {
        toast.success(`Cliente ${res.name} deletado com sucesso`);
        setData((prevData) => {
          const newData = { ...prevData };
          let index = newData.clientes.findIndex((item) => item.id === res.id);
          if (index > 0) {
            newData.clientes.splice(index, 1);
          }
          return newData;
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ao deletar cliente!");
      });
  }

  useEffect(() => {
    startTransition(() => {
      dados && dados.clientes && setClientes(dados.clientes);
    });
  }, [dados]);

  /*   useEffect(() => {
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
  }, [data]); */

  return (
    <div className="flex justify-center mt-[90px]">
      <div className="px-4 w-full max-w-[600px]">
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
                <div className="w-[85%]">
                  <CardCliente cliente={cliente} />
                </div>
                <div className="w-[15%] flex flex-col items-center justify-end gap-5 px-4">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost" className="p-0 m-0 h-5" asChild>
                        <Trash2Icon size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[250px] flex flex-col items-center">
                      <DialogHeader>
                        <DialogTitle>Atenção!</DialogTitle>
                      </DialogHeader>
                      <p>Deseja mesmo excluir</p>
                      <div className="flex w-full justify-around">
                        <Button
                          onClick={() => {
                            deleteCliente(parseInt(cliente.id.toString()));
                          }}
                          variant="default"
                          className="w-[60%]"
                        >
                          Sim
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clientes;
