"use client";

import Search from "@/components/search";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Veiculo } from "@prisma/client";
import CardVeiculo from "@/components/card-veiculo";
import { getAllVeiculos } from "../actions/get-veiculos";
import { deleteVeiculoById } from "../actions/delete-veiculos";

const PageVeiculos = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [veiculos, setVeiculos] = useState<Veiculo[]>();

  useEffect(() => {
    getAllVeiculos()
      .then((res) => {
        setVeiculos(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ano buscar veiculos!");
      });
  }, []);
  return (
    <div className="px-4">
      <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
        Veiculos
      </h2>
      <div className="mb-3">
        <Search origin="veiculos" action={setVeiculos} />
      </div>
      <div className="flex flex-col gap-1">
        {veiculos?.map((veiculo) => (
          <Card key={veiculo.id}>
            <CardContent className="p-2 flex justify-between">
              <CardVeiculo veiculo={veiculo} />
              <div className="flex flex-col justify-center gap-5 px-4">
                <Link href={`/veiculos/${veiculo.id}`} className="p-0 m-0">
                  <Edit size={20} />
                </Link>
                <Button
                  onClick={() => {
                    deleteVeiculoById(veiculo.id)
                      .then((res) => {
                        toast.success(
                          `Veículo com o id ${veiculo.id} foi excluído!`
                        );
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      })
                      .catch((err) => {
                        console.log(err);
                        toast.error("Não foi possível deletar o veículo!");
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

export default PageVeiculos;
