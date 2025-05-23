"use client";

import { Cliente } from "@prisma/client";
import CardVeiculo from "./card-veiculo";
import { useEffect, useState, useTransition } from "react";
import Loader from "./loader";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { DialogAgendamento } from "./dialog-agendamento";
import { toast } from "sonner";
import { VeiculoFull } from "@/app/page";

const CardVeiculoFull = ({
  veiculo: importedVeiculo,
}: {
  veiculo: VeiculoFull;
}) => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [veiculo, setVeiculo] = useState<VeiculoFull>();
  const [isPending, startTransition] = useTransition();
  const [isDialogAgendamentoOpen, setIsDialogAgendamentoOpen] =
    useState<boolean>(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [selectedVeiculos, setSelectedVeiculos] = useState<VeiculoFull[]>([]);

  useEffect(() => {
    startTransition(() => {
      if (data) {
        setVeiculo(importedVeiculo);
        setSelectedVeiculos([importedVeiculo]);
        setCliente(importedVeiculo.cliente);
      } else {
        toast.error(
          `Não foi possível localizar o veiculo com id ${importedVeiculo.id}`
        );
      }
    });
  }, [importedVeiculo, data]);
  return (
    <div className="flex flex-col">
      {isPending && <Loader />}
      {veiculo && <CardVeiculo veiculo={veiculo} />}
      {veiculo && veiculo.agendamentos.length > 0 ? (
        <div className="mt-3 gap-1 flex flex-col">
          {veiculo?.agendamentos
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
            .map((item: any, index: number) => (
              <div className="flex gap-2" key={item.agendamentoId}>
                <span className="text-sm font-bold italic">{index + 1}</span>
                <p className="text-sm italic text-ring">
                  {item.agendamento.serviceCompleted &&
                    Intl.DateTimeFormat("pt-br").format(
                      item.agendamento.serviceCompleted
                    )}
                </p>
                <p className="text-sm italic text-amber-600">
                  {
                    item.agendamento.pricePerVeiculo?.find(
                      (e: any) => e.veiculoId === item.veiculoId
                    )?.observacao
                  }
                </p>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-red-500 text-sm mt-3">Nunca foi atendido</p>
      )}
      <div className="flex justify-end">
        <Button
          variant="default"
          size="xs"
          className="w-fit"
          onClick={() => setIsDialogAgendamentoOpen(true)}
        >
          Cadastrar atendimento
        </Button>
        <DialogAgendamento
          setIsOpen={setIsDialogAgendamentoOpen}
          isOpen={isDialogAgendamentoOpen}
          cliente={cliente}
          veiculos={selectedVeiculos}
        />
      </div>
    </div>
  );
};

export default CardVeiculoFull;
