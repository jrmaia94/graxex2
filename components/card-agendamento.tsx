"use client";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { EyeIcon, Trash2, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "./ui/dialog";
import CardAgendamentoFull from "./card-agendamento-full";
import { Description } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { deleteAgendamentoById } from "@/app/actions/delete-agendamento";
import { toast } from "sonner";
//import CardAgendamentoFull from "./card-agendamento-full";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

interface AgendamentoProps extends Agendamento {
  cliente: ClienteFull;
  veiculos: Veiculo[];
}

const CardAgendamento = ({
  agendamento,
}: {
  agendamento: AgendamentoProps;
}) => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const deleteAgendamento = (id: number) => {
    data.user &&
      deleteAgendamentoById(id, data.user)
        .then((res) => {
          toast.success(`Agendamento com Id ${res.id} deletado com sucesso!`);
          setTimeout(() => {
            window.location.reload();
          }, 800);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Não foi possível deletar o agendamento!");
        });
  };
  return (
    <Card>
      <CardContent className="relative m-0 flex max-w-[90vw] flex-row items-center justify-between p-0">
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
            <h3 className="truncate text-lg">{agendamento.cliente.name}</h3>
            {agendamento.cliente.phone && (
              <Link
                href={`https://wa.me//${agendamento.cliente.phone}?text=Bom%20dia!%20Vamos%20engraxar%20hoje?`}
                target="_blank"
                className="flex gap-1"
              >
                <Image
                  className="rounded-full"
                  alt="Ícone Whatsapp"
                  src="./wpp-icon.svg"
                  width={15}
                  height={15}
                />
                <p className="text-ring text-sm">{agendamento.cliente.phone}</p>
              </Link>
            )}

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
          <Button
            size="xs"
            variant="ghost"
            className="absolute bottom-3 right-1"
            onClick={() => deleteAgendamento(agendamento.id)}
          >
            <Trash2 size={20} />
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="xs"
              variant="ghost"
              className="absolute right-1 top-3"
            >
              <EyeIcon size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="left-1/2 top-1/2 max-h-[600px] w-[90%] p-5">
            <DialogHeader>
              <Description></Description>
              <DialogTitle>Detalhes sobre o agendamento</DialogTitle>
            </DialogHeader>
            <div className="w-[100%]">
              <CardAgendamentoFull
                agendamento={agendamento}
                cliente={agendamento.cliente}
                veiculos={agendamento.veiculos}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CardAgendamento;
