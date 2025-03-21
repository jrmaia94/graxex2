"use client";

import { Prisma, Veiculo } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { getAllClientesForUnifyReport } from "../../actions/get-clientes";
import { useSession } from "next-auth/react";

import { SearchCliente } from "../components/searchCliente";
import Loader from "@/components/loader";
import ListAgendamentos from "../components/listAgendamentos";
import ListVeiculos from "../components/listVeiculos";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ClipboardListIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generate_PDF_agendamento_unificado } from "@/app/actions/generate-PDF-agendamento-unificado";

export type ClienteWithVeiculosAndAtendimentos = Prisma.ClienteGetPayload<{
  include: {
    veiculos: true;
    agendamentos: { include: { veiculos: { include: { veiculo: true } } } };
  };
}>;

type PropsForReport = {
  cliente: {
    name: string;
    CPFCNPJ: string;
    address: string;
  };
  dataForRel: Date;
  agendamento: {
    veiculos: {
      date: Date;
      placa: string;
      frota: string;
      fabricante: string;
      modelo: string;
      id: number;
    }[];
    pricePerVeiculo: {
      veiculoId: string;
      price: number;
      observacao: string;
    }[];
    quantity: number;
  };
};

const UnifyReportPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const [clientes, setClientes] = useState<
    ClienteWithVeiculosAndAtendimentos[]
  >([]);
  const [selectedCliente, setSelectedCliente] =
    useState<ClienteWithVeiculosAndAtendimentos | null>(null);
  const [isWiggle, setIsWiggle] = useState<boolean>(false);

  const [selectedAgendamentos, setSelectedAgendamentos] = useState<
    Prisma.AgendamentoGetPayload<{
      include: { veiculos: { include: { veiculo: true } } };
    }>[]
  >([]);

  const [selectedVeiculos, setSelectedVeiculos] = useState<
    (Veiculo & { date: Date })[]
  >([]);
  const [dateReport, setDateReport] = useState<Date | null>(null);

  function handleClick() {
    startTransition(() => {
      const pricePerVeiculo: {
        veiculoId: string;
        price: number;
        observacao: string;
      }[] = [];
      selectedAgendamentos.forEach((agendamento) => {
        agendamento.pricePerVeiculo.forEach((item: any) => {
          pricePerVeiculo.push({
            veiculoId: item?.veiculoId ?? "",
            price: item?.price ?? "",
            observacao: item?.observacao ?? "",
          });
        });
      });
      const data: PropsForReport = {
        agendamento: {
          veiculos: selectedVeiculos.map((veiculo) => ({
            placa: veiculo.placa,
            frota: veiculo.frota ?? "",
            fabricante: veiculo.fabricante ?? "",
            modelo: veiculo.modelo,
            id: veiculo.id,
            date: veiculo.date,
          })),
          pricePerVeiculo: [...pricePerVeiculo.flat()],
          quantity: selectedAgendamentos.length,
        },
        cliente: {
          name: selectedCliente?.name ?? "",
          CPFCNPJ: selectedCliente?.CPFCNPJ ?? "",
          address: selectedCliente?.address ?? "",
        },
        dataForRel: dateReport || new Date(),
      };
      generate_PDF_agendamento_unificado(data);
    });
  }

  useEffect(() => {
    startTransition(() => {
      if (data) {
        getAllClientesForUnifyReport(data.user).then((res) => {
          if (res) {
            setClientes(res);
          }
        });
      }
    });
  }, [data]);

  useEffect(() => {
    if (id) {
      const cliente = clientes.find((e) => e.id === parseInt(id));
      if (cliente) {
        setSelectedCliente(cliente);
      }
    }
  }, [id, clientes]);

  useEffect(() => {
    setIsWiggle(true);
    setTimeout(() => {
      setIsWiggle(false);
    }, 750);
  }, [selectedVeiculos]);

  return (
    <div className="w-full h-screen flex pt-[90px] relative">
      {isPending && <Loader />}
      {/* ESQUERDA */}
      <div className="w-[100%] p-2 gap-2 flex flex-col">
        <SearchCliente clientes={clientes} selectedCliente={selectedCliente} />
        <div className="flex flex-col md:flex-row gap-2 w-full md:justify-center items-center">
          <ScrollArea className="md:h-[700px] h-[350px] md:min-w-[48%] min-w-full bg-gray-300 rounded-md py-0">
            {selectedCliente && (
              <ListAgendamentos
                setSelectedAgendamentos={setSelectedAgendamentos}
                agendamentos={selectedCliente.agendamentos}
              />
            )}
            <ScrollBar />
          </ScrollArea>
          <ScrollArea className="md:h-[700px] h-[350px] bg-gray-300 md:min-w-[48%] min-w-full rounded-md p-2 py-0">
            {selectedAgendamentos.length > 0 && (
              <ListVeiculos
                setSelectedVeiculos={setSelectedVeiculos}
                selectedAgendamentos={selectedAgendamentos}
              />
            )}
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={cn(
              "hover:scale-110 duration-200 cursor-pointer fixed right-[16px] top-[100px] bg-sky-500 text-primary rounded-full p-3 shadow-lg",
              isWiggle && "animate-[wiggle_150ms_linear_infinite]"
            )}
          >
            <div className="relative">
              <ClipboardListIcon />
              <Badge className="absolute -right-4 -bottom-4 rounded-full w-6 h-6 flex justify-center items-center text-xs m-0 p-1">
                <span>{selectedVeiculos.length}</span>
              </Badge>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-primary text-primary-foreground">
          <DialogHeader>
            <DialogTitle>Gerar relatório unificado</DialogTitle>
            <DialogDescription>
              Selecione uma das data ou coloque manualmente.
              <br />
              Essa será a data de emissão do relatório.
            </DialogDescription>
          </DialogHeader>
          <fieldset className="rounded-md gap-2 grid grid-cols-auto-fit">
            {selectedAgendamentos.map((item) => (
              <div
                key={item.id}
                className="flex items-center w-fit p-2 gap-2 border h-[40px] border-input rounded-sm"
              >
                <Checkbox
                  className="border-gray-400"
                  checked={dateReport === item.date}
                  onCheckedChange={(isChecked) => {
                    if (isChecked) {
                      setDateReport(item.date);
                    } else {
                      setDateReport(null);
                    }
                  }}
                />
                <span>
                  {Intl.DateTimeFormat("pt-br", { dateStyle: "short" }).format(
                    item.date
                  )}
                </span>
              </div>
            ))}

            <Input
              type="date"
              className="bg-primary text-primary-foreground w-fit"
              onChange={(e) => {
                setDateReport(new Date(e.target.value + "T12:00:00"));
              }}
            />
          </fieldset>
          <Button
            onClick={handleClick}
            className="bg-primary-foreground text-primary w-fit hover:bg-muted-foreground"
          >
            Gerar relatório
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifyReportPage;
