"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AlertTriangleIcon, EyeIcon, Trash2, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import CardAgendamentoFull from "./card-agendamento-full";
import { useSession } from "next-auth/react";
import { deleteAgendamentoById } from "@/app/actions/delete-agendamento";
import { toast } from "sonner";
import { AgendamentoFull } from "@/app/page";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { updateIsPaidAgendamento } from "@/app/actions/update-is-paid-agendamento";
//import CardAgendamentoFull from "./card-agendamento-full";

const CardAgendamento = ({
  agendamento,
  source,
}: {
  agendamento: AgendamentoFull;
  source?: string;
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
    <Card className={cn(!agendamento.paid && "bg-red-950")}>
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
            <div className="flex gap-4">
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
                </Link>
              )}
            </div>

            <p className="text-xs italic">
              {agendamento.veiculos.length > 1
                ? `${agendamento.veiculos.length} veículos`
                : `${agendamento.veiculos.length} veículo`}
            </p>
            <span>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(agendamento.price)}
            </span>
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
          <p className="text-xs font-light">
            {Intl.DateTimeFormat("pt-BR", { year: "numeric" }).format(
              agendamento.date
            )}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="xs"
                variant="ghost"
                className="absolute bottom-2 right-1"
              >
                <Trash2 size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangleIcon />
                  Alerta
                </DialogTitle>
                <DialogDescription>
                  Deseja mesmo excluir o atendimento?
                </DialogDescription>
              </DialogHeader>
              <div className="flex w-full justify-end gap-4">
                <Button
                  className="w-36"
                  variant={"destructive"}
                  onClick={() => deleteAgendamento(agendamento.id)}
                >
                  Excluir
                </Button>
                <DialogClose asChild>
                  <Button className="w-36">Cancelar</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
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
          <DialogContent className="flex flex-col items-start w-[90%] p-5">
            <DialogHeader>
              <DialogTitle>Detalhes sobre o agendamento</DialogTitle>
            </DialogHeader>
            <CardAgendamentoFull
              agendamento={agendamento}
              cliente={agendamento.cliente}
              veiculos={agendamento.veiculos.map((e) => e.veiculo)}
            />
          </DialogContent>
        </Dialog>
        {source === "simples" && (
          <div className="absolute right-3.5">
            <Input
              type="checkbox"
              className="h-4 w-4"
              defaultChecked={agendamento.paid}
              onChange={(e) => {
                updateIsPaidAgendamento(agendamento.id, e.target.checked)
                  .then((res) => {
                    toast.success(
                      `Status do pagamento do cliente ${
                        agendamento.cliente.name
                      } referente ao dia ${Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      }).format(agendamento.date)} atualizado para ${
                        res.paid ? "PAGO" : "NÃO PAGO"
                      }`
                    );
                  })
                  .catch((err) => {
                    console.error(err);
                    toast.error("Erro ao atualizar o status do pagamento!");
                  });
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardAgendamento;
