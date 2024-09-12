"use client";

import Search from "@/components/search";
import { useEffect, useState, useTransition } from "react";
import {
  getAgendamentosFuturos,
  getAllAgendamentos,
} from "../actions/get-agendamentos";
import { toast } from "sonner";
import CardAgendamento from "@/components/card-agendamento";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

interface AgendamentoProps extends Agendamento {
  cliente: ClienteFull;
  veiculos: Veiculo[];
}

const Agendamentos = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [agendamentos, setAgendamentos] = useState<AgendamentoProps[]>([]);
  const [loadAllAgendamentos, setLoadAllAgendamentos] =
    useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (loadAllAgendamentos) {
        data?.user &&
          getAllAgendamentos(data.user)
            .then((res) => {
              const newObj = res.map((e) => {
                return {
                  ...e,
                  veiculos: e.veiculos.map((veiculo) => veiculo.veiculo),
                };
              });
              setAgendamentos(newObj);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Erro ao buscar os agendamentos!");
            });
      } else {
        data?.user &&
          getAgendamentosFuturos(data.user)
            .then((res) => {
              const newObj = res.map((e) => {
                return {
                  ...e,
                  veiculos: e.veiculos.map((veiculo) => veiculo.veiculo),
                };
              });
              setAgendamentos(newObj);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Erro ao buscar os agendamentos!");
            });
      }
    });
  }, [loadAllAgendamentos, data]);

  return (
    <div className="flex justify-center mt-[90px]">
      <div className="px-4 w-full max-w-[600px]">
        {isPending && <Loader />}
        <h2 className="mb-3 mt-4 text-lg font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <div className="mb-3">
          <Search origin="agendamentos" action={setAgendamentos} />
        </div>
        <div
          className={loadAllAgendamentos ? "hidden" : "w-full flex justify-end"}
        >
          <Button onClick={() => setLoadAllAgendamentos(true)} className="mb-3">
            <ArrowDownIcon />
            Carregar todos agendamentos
          </Button>
        </div>
        {agendamentos.map((agendamento) => (
          <CardAgendamento key={agendamento.id} agendamento={agendamento} />
        ))}
      </div>
    </div>
  );
};

export default Agendamentos;
