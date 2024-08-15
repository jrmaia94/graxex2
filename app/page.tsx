"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAgendamentos } from "./actions/get-agendamentos";
import { toast } from "sonner";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import CardAgendamento from "@/components/card-agendamento";

export interface CardAgendamentoProps extends Agendamento {
  cliente: Cliente;
  veiculos: Veiculo[];
}

const Home = () => {
  const [userIsAuthorized, setUserIsAuthorized] = useState(false);
  const [agendamentos, setAgendamentos] = useState<CardAgendamentoProps[]>([]);
  const { data }: { data: any } = useSession({
    required: true,
  });

  useEffect(() => {
    getAgendamentos()
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
        toast.error("Não foi possível carregar os agendamentos!");
      });
  }, []);

  useEffect(() => {
    data?.user?.perfil ? setUserIsAuthorized(true) : setUserIsAuthorized(false);
  }, [data]);

  return (
    <div>
      <Image
        alt="Foto graxex"
        src="/background.jpeg"
        className="max-h-[300px] object-cover opacity-80"
        height={1000}
        width={1000}
      />
      <ScrollArea>
        {agendamentos.map((agendamento) => {
          return (
            <div className="pb-2" key={agendamento.id}>
              <CardAgendamento agendamento={agendamento} />
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default Home;
