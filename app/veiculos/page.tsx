"use client";

import Search from "@/components/search";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  EllipsisIcon,
  EyeIcon,
  Trash2Icon,
  TruckIcon,
  WrenchIcon,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogAgendamento } from "@/components/dialog-agendamento";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const PageVeiculos = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const [veiculos, setVeiculos] = useState<VeiculoFull[]>([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState<VeiculoFull[]>([]);
  const [isDialogAgendamentoOpen, setIsDialogAgendamentoOpen] =
    useState<boolean>(false);

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

  useEffect(() => {
    setFilteredVeiculos(veiculos);
  }, [veiculos]);

  return (
    <div className="flex justify-center mt-[90px]">
      {isPending && <Loader />}
      <div className="px-4 w-full max-w-[600px]">
        <div className="w-full left-0 top-[90px] px-4 z-10 bg-gray-800/[.97] fixed flex flex-col">
          <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
            Veiculos
          </h2>
          <div className="mb-3 flex w-full gap-2">
            <Search
              origin="veiculos"
              state={veiculos}
              action={setFilteredVeiculos}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[120px]">
          {filteredVeiculos?.map((veiculo) => (
            <Card key={veiculo.id}>
              <CardContent className="p-2 h-20 flex justify-between relative">
                <CardVeiculo veiculo={veiculo} />
                <div className="absolute top-1/2 -translate-y-1/2 right-0 flex flex-col justify-center gap-2 px-4">
                  <DropdownMenu modal>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background shadow-md shadow-black/40 flex flex-col gap-0 min-w-fit w-fit p-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="p-3 my-4 h-5 w-fit"
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
                      <Button
                        size="xs"
                        variant="ghost"
                        className="p-3 my-4 h-5 w-fit"
                        onClick={() =>
                          setIsDialogAgendamentoOpen(!isDialogAgendamentoOpen)
                        }
                      >
                        <WrenchIcon size={20} />
                      </Button>
                      <DialogAgendamento
                        setIsOpen={setIsDialogAgendamentoOpen}
                        isOpen={isDialogAgendamentoOpen}
                        cliente={veiculo.cliente}
                        veiculos={[veiculo]}
                      />
                      <Button
                        size="xs"
                        variant="ghost"
                        className="p-3 my-4 h-5 w-fit"
                        asChild
                      >
                        <Link href={`/dashboard/${veiculo.cliente.id}`}>
                          <TruckIcon size={20} />
                        </Link>
                      </Button>
                      <Separator className="bg-white/80" />
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
                                toast.error(
                                  "Não foi possível deletar o veículo!"
                                );
                              });
                        }}
                        variant="ghost"
                        className="p-3 my-4 h-5 w-fit text-red-600"
                      >
                        <Trash2Icon size={20} />
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
