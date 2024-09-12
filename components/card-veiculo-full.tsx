"use client";

import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import CardVeiculo from "./card-veiculo";
import { useEffect, useState, useTransition } from "react";
import Loader from "./loader";
import { getFullVeiculoById } from "@/app/actions/get-veiculos";
import { useSession } from "next-auth/react";

interface VeiculoFull extends Veiculo {
  agendamentos: {
    agendamentoId: number;
    veiculoId: number;
    agendamento: Agendamento;
  }[];
  cliente: Cliente;
}

const CardVeiculoFull = ({
  veiculo: importedVeiculo,
}: {
  veiculo: Veiculo;
}) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [veiculo, setVeiculo] = useState<VeiculoFull>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      getFullVeiculoById(importedVeiculo.id, data.user)
        .then((res) => {
          res && setVeiculo(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [importedVeiculo, data]);
  return (
    <div className="flex flex-col">
      {isPending && <Loader />}
      {veiculo && <CardVeiculo veiculo={veiculo} />}
      {veiculo && veiculo.agendamentos.length > 0 ? (
        <div className="mt-3 gap-1 flex flex-col">
          {veiculo?.agendamentos.map((item: any, index: number) => (
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
    </div>
  );
};

export default CardVeiculoFull;
