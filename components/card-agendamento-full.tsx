import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import CardCliente from "./card-cliente";
import { Card, CardContent } from "./ui/card";
import CardVeiculo from "./card-veiculo";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { generate_PDF_Agendamento } from "@/app/actions/generate-PDF-agendamento";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

const CardAgendamentoFull = ({
  agendamento,
  cliente,
  veiculos,
}: {
  agendamento: Agendamento;
  veiculos: Veiculo[];
  cliente: ClienteFull;
}) => {
  return (
    <Card>
      <CardContent className="flex max-h-[70vh] flex-col gap-0 overflow-hidden p-2">
        <div className="flex w-full justify-end py-1 pe-2 relative">
          <div className="absolute top-0 left-1 flex gap-1">
            <Link
              className="flex items-center"
              href={`/agendamentos/${agendamento.id}`}
            >
              <Edit />
            </Link>
            <Button
              variant="outline"
              size="xs"
              className="rounded-full bg-transparent"
              onClick={() =>
                generate_PDF_Agendamento({
                  cliente: cliente,
                  agendamento: agendamento,
                })
              }
            >
              <Image
                alt="Icon PDF"
                src="/pdf_icon.svg"
                width={20}
                height={20}
              />
            </Button>
          </div>
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
              <div key={veiculo.id} className="border-b border-solid p-2">
                <CardVeiculo veiculo={{ ...veiculo, cliente: cliente }} />
              </div>
            ))}
            <ScrollBar />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardAgendamentoFull;
