"use client";

import { AgendamentoFull } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CardAgendamentoFullDoCliente from "./cardAgendamentoFull";

const CardAgendamentoDoCliente = ({
  agendamento,
}: {
  agendamento: AgendamentoFull;
}) => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  return (
    <Card className="max-w-[400px] bg-primary text-primary-foreground">
      <CardContent className="relative bg m-0 flex max-w-[90vw] flex-row items-center justify-between p-0">
        <div className="flex w-[70%] flex-row items-center gap-2 border-r border-solid py-3 ps-2">
          {agendamento.cliente.imageUrl ? (
            <Image
              className="h-[50px] w-[50px] rounded-full object-cover"
              width={50}
              height={50}
              alt="Imagem do cliente"
              src={agendamento.cliente.imageUrl}
            />
          ) : (
            <UserIcon size={50} />
          )}
          <div className="overflow-hidden">
            <h3 className="truncate text-lg mb-2">
              {agendamento.cliente.name}
            </h3>
            <p className="text-xs italic">
              {agendamento.veiculos.length > 1
                ? `${agendamento.veiculos.length} veículos`
                : `${agendamento.veiculos.length} veículo`}
            </p>
          </div>
        </div>
        <div className="flex w-[30%] flex-col items-center justify-center gap-1 px-2 py-3 pr-8">
          <p className="text-xs font-light">
            {Intl.DateTimeFormat("pt-BR", { month: "long" })
              .format(agendamento.date)
              .split("")
              .map((e, i) => (i === 0 ? e.toUpperCase() : e))
              .join("")}
          </p>
          <p className="text-3xl font-bold">
            {Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(
              agendamento.date
            )}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="xs"
              variant="ghost"
              className="absolute right-1 top-2"
            >
              <EyeIcon size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-start w-[90%] py-8 px-1 rounded-lg">
            <DialogHeader>
              <DialogTitle>Detalhes sobre o agendamento</DialogTitle>
            </DialogHeader>
            <CardAgendamentoFullDoCliente
              agendamento={agendamento}
              cliente={agendamento.cliente}
              veiculos={agendamento.veiculos.map((e) => e.veiculo)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CardAgendamentoDoCliente;
