"use client";

import CardCliente from "@/components/card-cliente";
import Search from "@/components/search";
import { useEffect, useState, useTransition } from "react";
import { getAllClientes } from "../actions/get-clientes";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { deleteClienteById } from "../actions/delete-clientes";
import Loader from "@/components/loader";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClienteFull } from "../page";

const Clientes = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const [clientes, setClientes] = useState<ClienteFull[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<ClienteFull[]>([]);

  function deleteCliente(id: number) {
    deleteClienteById(id, data.user)
      .then((res) => {
        toast.success(`Cliente ${res.name} deletado com sucesso`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ao deletar cliente!");
      });
  }

  useEffect(() => {
    startTransition(() => {
      data?.user &&
        getAllClientes(data.user)
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
          });
    });
  }, [data]);

  useEffect(() => {
    setFilteredClientes(clientes);
  }, [clientes]);

  return (
    <div className="flex justify-center mt-[90px]">
      {isPending && <Loader />}
      <div className="px-4 w-full max-w-[600px]">
        <div className="w-full left-0 top-[90px] px-4 z-10 bg-gray-800/[.97] fixed flex flex-col">
          <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
            Clientes
          </h2>
          <div className="mb-3 flex w-full gap-2">
            <Search
              origin="clientes"
              state={clientes}
              action={setFilteredClientes}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[120px]">
          {filteredClientes?.map((cliente) => (
            <Card key={cliente.id}>
              <CardContent className="p-2 flex justify-between">
                <div className="w-[100%]">
                  <CardCliente cliente={cliente} />
                </div>
                {/* <div className="w-[15%] flex flex-col items-center justify-end gap-5 px-4">
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
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clientes;
