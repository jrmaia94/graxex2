"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Cliente, Prisma } from "@prisma/client";
import { EyeIcon } from "lucide-react";
import Teste from "@/components/card-veiculo";

type Veiculo = Prisma.VeiculoGetPayload<{
  include: { agendamentos: { include: { agendamento: true } } };
}> & {
  lastAgendamento: Date;
};

interface CardVeiculoProps {
  veiculo: Veiculo;
  cliente?: Cliente;
}

const CardVeiculo = ({ veiculo, cliente }: CardVeiculoProps) => {
  const ciclo =
    veiculo.ciclo > 0
      ? veiculo.ciclo
      : cliente && cliente.ciclo > 0
      ? cliente.ciclo
      : 25;

  return (
    <div
      key={veiculo.id}
      className="flex items-center p-1 bg-slate-200 rounded-md h-fit text-primary-foreground max-w-[400px] relative"
    >
      <Dialog>
        <DialogTrigger asChild>
          <span className="absolute top-1 left-1">
            <EyeIcon />
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="flex flex-col gap-2">
            <span>
              {veiculo.fabricante} - {veiculo.modelo}
            </span>
            <span className="text-sm">Placa: {veiculo.placa}</span>
            {veiculo.frota && !isNaN(parseInt(veiculo.frota)) && (
              <span className="text-sm">{veiculo.frota}</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-lg flex flex-col">
            Serviços realizados
          </DialogDescription>
          {veiculo.agendamentos
            .sort((a, b) => {
              if (
                a.agendamento.serviceCompleted &&
                b.agendamento.serviceCompleted
              ) {
                if (
                  a.agendamento.serviceCompleted <
                  b.agendamento.serviceCompleted
                ) {
                  return -1;
                } else {
                  return 1;
                }
              }
              return 0;
            })
            .map((item, index) => {
              const agendamento = item.agendamento;
              if (agendamento.serviceCompleted) {
                return (
                  <div key={"unique"} className="flex gap-2">
                    <p>{index + 1}</p>
                    <p className="text-slate-300 italic">
                      {Intl.DateTimeFormat("Pt-BR", {
                        dateStyle: "short",
                      }).format(agendamento.serviceCompleted)}
                    </p>
                  </div>
                );
              }
            })}
        </DialogContent>
      </Dialog>
      <div className="w-[70%] text-sm">
        <div className="flex items-center gap-1 truncate text-ellipsis">
          <span className="text-[0.6rem] text-muted-foreground w-[80px] text-right">
            Modelo:{" "}
          </span>
          <p>{veiculo.modelo}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[0.6rem] text-muted-foreground w-[80px] text-right">
            Fabricante:{" "}
          </span>
          <p>{veiculo.fabricante}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[0.6rem] text-muted-foreground w-[80px] text-right">
            Placa:{" "}
          </span>
          <p className="text-sm">{veiculo.placa}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[0.6rem] text-muted-foreground w-[80px] text-right">
            Frota:{" "}
          </span>
          <p className="text-sm">{veiculo.frota}</p>
        </div>
      </div>
      <Separator
        decorative
        orientation="vertical"
        className="bg-muted-foreground h-[60px] mx-1"
      />
      <div className="flex flex-col items-center max-w-[25%]">
        <p className="text-[10px]">ult. atend. em: </p>
        <span
          className={cn(
            "text-xs",
            veiculo.lastAgendamento
              ? (Date.now() - Date.parse(veiculo.lastAgendamento.toString())) /
                  1000 /
                  60 /
                  60 /
                  24 >=
                  ciclo && "text-red-500"
              : "text-red-500"
          )}
        >
          {veiculo.lastAgendamento
            ? Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
              }).format(veiculo.lastAgendamento)
            : "Nunca foi atendido"}
        </span>
        <span
          className={cn(
            "text-xs",
            veiculo.lastAgendamento
              ? (Date.now() - Date.parse(veiculo.lastAgendamento.toString())) /
                  1000 /
                  60 /
                  60 /
                  24 >=
                  ciclo && "text-red-500"
              : "text-red-500"
          )}
        >
          {veiculo.lastAgendamento &&
            Math.round(
              (Date.now() - Date.parse(veiculo.lastAgendamento.toString())) /
                1000 /
                60 /
                60 /
                24
            )}{" "}
          dias
        </span>
      </div>
    </div>
  );
};

export default CardVeiculo;
