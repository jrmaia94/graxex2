"use client";

import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import CardVeiculo from "./card-veiculo";
import { useContext, useEffect, useState, useTransition } from "react";
import Loader from "./loader";
import { getFullVeiculoById } from "@/app/actions/get-veiculos";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { CircleCheckBig } from "lucide-react";
import { DialogAgendamento } from "./dialog-agendamento";
import { ClienteFull, DataContext, VeiculoFull } from "@/providers/store";
import { toast } from "sonner";

const CardVeiculoFull = ({
  veiculo: importedVeiculo,
}: {
  veiculo: Veiculo;
}) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const { data: dados } = useContext(DataContext);

  const [veiculo, setVeiculo] = useState<VeiculoFull>();
  const [isPending, startTransition] = useTransition();
  const [isDialogAgendamentoOpen, setIsDialogAgendamentoOpen] =
    useState<boolean>(false);
  const [cliente, setCliente] = useState<ClienteFull | null>(null);
  const [selectedVeiculos, setSelectedVeiculos] = useState<VeiculoFull[]>([]);

  useEffect(() => {
    startTransition(() => {
      if (data && dados?.veiculos) {
        let localVeiculo = dados.veiculos.find(
          (item) => item.id === importedVeiculo.id
        );
        if (localVeiculo) {
          setVeiculo(localVeiculo);
          setSelectedVeiculos([localVeiculo]);
          setCliente(
            dados.clientes.find((item) => item.id === localVeiculo.clienteId) ||
              null
          );
        } else {
          toast.error(
            `Não foi possível localizar o veiculo com id ${importedVeiculo.id}`
          );
        }
      }
    });
  }, [importedVeiculo, data, dados]);
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
