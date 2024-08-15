import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import CardCliente from "./card-cliente";
import { Card, CardContent } from "./ui/card";
import CardVeiculo from "./card-veiculo";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Edit } from "lucide-react";

interface CardAgendamentoProps {
  agendamento: Agendamento;
  cliente: Cliente;
  veiculos: Veiculo[];
}

const CardAgendamentoFull = ({
  agendamento,
  cliente,
  veiculos,
}: CardAgendamentoProps) => {
  return (
    <Card>
      <CardContent className="flex max-h-[70vh] flex-col gap-0 overflow-hidden p-2">
        <div className="flex w-full justify-end py-1 pe-2 relative">
          <Edit className="absolute top-1 left-1" />
          <p className="text-lg italic">
            {Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(agendamento.date)}
          </p>
        </div>
        <div className="border-b border-solid pb-2">
          <h3 className="font-bold uppercase text-gray-400">Cliente</h3>
          <CardCliente cliente={cliente} />
        </div>
        <div className="pt-1">
          <h3 className="mb-2 font-bold uppercase text-gray-400">Veículos</h3>
          <ScrollArea className="h-72 w-full rounded-md border-none">
            {veiculos.map((veiculo) => (
              <CardVeiculo key={veiculo.id} veiculo={veiculo} />
            ))}
            <ScrollBar />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardAgendamentoFull;