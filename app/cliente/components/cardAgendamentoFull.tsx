"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Agendamento, Cliente, Prisma, Veiculo } from "@prisma/client";
import CardSimpleVeiculo from "./cardSimpleVeiculo";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

const CardAgendamentoFullDoCliente = ({
  agendamento,
  cliente,
  veiculos,
}: {
  agendamento: Agendamento;
  veiculos: Veiculo[];
  cliente: ClienteFull;
}) => {
  return (
    <Card className="w-full bg-transparent">
      <CardContent className="flex w-full flex-col gap-0 overflow-hidden p-2 relative">
        <div className="flex w-full gap-2 py-1 pe-2">
          <span className="text-muted-foreground">Data: </span>
          <p className="hidden sm:block text-xl  italic">
            {Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(agendamento.date)}
          </p>
          <p className="text-xl sm:hidden italic">
            {Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(agendamento.date)}
          </p>
        </div>
        <div className="flex w-full gap-2 py-1 pe-2">
          <span className="text-muted-foreground">Valor:</span>
          <span className="text-lg">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(agendamento.price)}
          </span>
        </div>
        <div className="pt-1">
          <h3 className="mt-2 font-bold uppercase text-gray-400">Veículos</h3>
          <ScrollArea className="h-72 w-full rounded-md border-none">
            {veiculos.map((veiculo) => (
              <div key={veiculo.id} className="border-b border-solid p-2">
                <CardSimpleVeiculo
                  veiculo={{ ...veiculo, cliente: cliente }}
                  obs={agendamento.pricePerVeiculo.find(
                    (i: any) => i.veiculoId === veiculo.id
                  )}
                />
              </div>
            ))}
            <ScrollBar />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardAgendamentoFullDoCliente;
