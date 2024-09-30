"use client";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useTransition } from "react";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import Loader from "@/components/loader";
import { DataContext } from "@/providers/store";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CardCliente from "@/components/card-cliente";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getAgendamentosFinalizados } from "./actions/get-agendamentos";
import { generate_PDF_recibo } from "./actions/generate-PDF-recibo";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

interface AgendamentoProps extends Agendamento {
  cliente: ClienteFull;
  veiculos: Veiculo[];
}

const Home = () => {
  const {} = useTransition();
  const [isPending, startTransition] = useTransition();
  const { data }: { data: any } = useSession({
    required: true,
  });
  const { data: dados } = useContext(DataContext);

  const clientes = dados?.clientes;
  const agendamentosFinalizados = dados?.agendamentos;
  /* useEffect(() => {
    agendamentosFinalizados &&
      generate_PDF_recibo(
        agendamentosFinalizados.find((e) => e.cliente.address !== null)
      );
  }, [agendamentosFinalizados]); */

  const emTeste = true;

  return !emTeste ? (
    <div className="flex justify-center mt-[90px]">
      <div className="w-full px-10 max-w-[920px] mx-auto flex flex-wrap justify-center relative gap-2">
        {isPending && <Loader />}
        {clientes?.map((cliente) => (
          <Dialog key={cliente.id}>
            <DialogTrigger asChild>
              <Button className="w-[150px] h-[80px] overflow-clip whitespace-normal">
                {cliente.name}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{cliente.name}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-64 w-full">
                {cliente.veiculos.map((veiculo) => (
                  <div key={veiculo.id} className="flex flex-col gap-2">
                    <div className="gap-2 flex">
                      <span>{veiculo.frota}</span>
                      <span>{veiculo.placa}</span>
                      <span>{veiculo.fabricante}</span>
                      <span>{veiculo.modelo}</span>
                    </div>
                    <div className="gap-2 flex">
                      <span>
                        {Intl.DateTimeFormat("pt-br", {
                          dateStyle: "long",
                        }).format(
                          dados?.agendamentos
                            .find(
                              (e) =>
                                e.clienteId === cliente.id &&
                                e.veiculos
                                  .map((i) => i.veiculoId)
                                  .includes(veiculo.id)
                            )
                            ?.date.getTime()
                        )}
                      </span>
                      <span>
                        {Math.round(
                          (new Date(Date.now()).setHours(6) -
                            (dados?.agendamentos
                              .find(
                                (e) =>
                                  e.clienteId === cliente.id &&
                                  e.veiculos
                                    .map((i) => i.veiculoId)
                                    .includes(veiculo.id)
                              )
                              ?.date.setHours(6) || 0)) /
                            1000 /
                            60 /
                            60 /
                            24
                        )}{" "}
                        dia(s)
                      </span>
                    </div>
                  </div>
                ))}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Home;
