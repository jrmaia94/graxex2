"use client";

import Search from "@/components/search";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import CardVeiculo from "@/components/card-veiculo";
import { getAllVeiculos } from "../actions/get-veiculos";
import { deleteVeiculoById } from "../actions/delete-veiculos";
import Loader from "@/components/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CardVeiculoFull from "@/components/card-veiculo-full";
import { VeiculoFull } from "../page";

const PageVeiculos = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const [veiculos, setVeiculos] = useState<VeiculoFull[]>([]);

  useEffect(() => {
    startTransition(() => {
      data?.user &&
        getAllVeiculos(data.user)
          .then((res) => {
            setVeiculos(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ano buscar veiculos!");
          });
    });
  }, [data]);

  return (
    <div className="flex justify-center mt-[90px]">
      {isPending && <Loader />}
      <div className="px-4 w-full max-w-[600px]">
        <div className="w-full left-0 top-[90px] px-4 z-10 bg-gray-800/[.97] fixed flex flex-col">
          <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
            Veiculos
          </h2>
          <div className="mb-3 flex w-full gap-2">
            <Search origin="veiculos" action={setVeiculos} />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[120px]">
          {veiculos?.map((veiculo) => (
            <Card key={veiculo.id}>
              <CardContent className="p-2 h-20 flex justify-between relative">
                <CardVeiculo veiculo={veiculo} />
                <div className="absolute top-0 right-0 flex flex-col justify-center gap-2 px-4">
                  <Button
                    onClick={() => {
                      data?.user &&
                        deleteVeiculoById(veiculo.id, data.user)
                          .then(() => {
                            toast.success(
                              `Veículo com o id ${veiculo.id} foi excluído!`
                            );
                          })
                          .catch((err) => {
                            console.log(err);
                            toast.error("Não foi possível deletar o veículo!");
                          });
                    }}
                    variant="ghost"
                    className="p-0 m-0 h-5 absolute right-1 bottom-4"
                  >
                    <Trash2Icon size={20} />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="p-0 m-0 h-5 absolute right-1 top-2"
                      >
                        <EyeIcon size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="left-1/2 top-1/2 max-h-[600px] w-[90%] p-5">
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                      </DialogHeader>
                      <div className="w-[100%]">
                        <CardVeiculoFull veiculo={veiculo} />
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

export default PageVeiculos;
