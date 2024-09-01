import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Edit, EyeIcon, Trash2, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { CardAgendamentoProps } from "@/app/page";
//import CardAgendamentoFull from "./card-agendamento-full";

const CardAgendamentoFinalizado = ({
  agendamento,
}: {
  agendamento: CardAgendamentoProps;
}) => {
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
                <p className="">{agendamento.cliente.phone}</p>
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
          <p className="text-xs font-light w-full text-wrap text-center">
            Dias desde o último atendimento
          </p>
          <p className="text-3xl font-bold">
            {agendamento.serviceCompleted &&
              Math.round(
                (new Date(Date.now()).valueOf() -
                  agendamento.serviceCompleted.valueOf()) /
                  1000 /
                  60 /
                  60 /
                  24
              )}
          </p>
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
          <DialogContent className="left-1/2 top-1/2 min-h-[100px] w-[90%] p-5">
            <DialogHeader>Detalhes sobre o agendamento</DialogHeader>
            <div className="w-[100%]">
              {/*               <CardAgendamentoFull
                agendamento={agendamento}
                cliente={cliente}
                veiculos={veiculos}
              /> */}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CardAgendamentoFinalizado;
