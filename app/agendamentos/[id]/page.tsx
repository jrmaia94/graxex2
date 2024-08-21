"use client";

import { getAgendamentoById } from "@/app/actions/get-agendamentos";
import { getAllClientes, getClienteById } from "@/app/actions/get-clientes";
import FormSelectCliente from "@/components/form-select-clientes";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/loader";

interface PageAgendamentoProps {
  params: {
    id: string;
  };
}

interface AgendamentoFull extends Agendamento {
  cliente: Cliente;
  veiculos: Veiculo[];
}

const AgendamentoPage = ({ params }: PageAgendamentoProps) => {
  const [agendamento, setAgendamento] = useState<AgendamentoFull>();
  const [isPending, startTransition] = useTransition();
  const [selectedCliente, setSelectedCliente] = useState<number>(-1);
  const [clientes, setClientes] = useState<Cliente[]>();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [date, setDate] = useState<Date>();
  const [dateProvided, setDateProvided] = useState<Date | null>();
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const inputIDRef = useRef<any>();

  const handleSubmit = () => {};

  // Lidando com a edição de agendamento
  useEffect(() => {
    startTransition(() => {
      getAllClientes()
        .then((res) => {
          setClientes(res);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Erro ao buscar clientes!");
        });
      params.id !== "create" &&
        getAgendamentoById(parseInt(params.id))
          .then((res) => {
            if (!res) toast.info("Cliente não encontrado!");
            if (res) {
              const newObj = {
                ...res,
                veiculos: res?.veiculos.map((e) => e.veiculo),
              };
              setAgendamento(newObj);
              setIsUpdate(true);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Não foi possível buscar os agendamentos!");
          });
    });
  }, [params]);

  // Buscando veículos com o cliente for selecionado
  useEffect(() => {
    getClienteById(selectedCliente)
      .then((res) => {
        setVeiculos(res?.veiculos || []);
      })
      .catch((err) => {
        console.log(err);
        toast.info("Nenhum veículo encontrado!");
      });
  }, [selectedCliente]);

  // Lidando com a atualização do formulário quando aberto com cliente
  useEffect(() => {
    console.log(agendamento);
    inputIDRef.current.value = agendamento?.id || "";
    setSelectedCliente(agendamento?.clienteId || -1);
    setVeiculos(agendamento?.veiculos ? [...agendamento?.veiculos] : []);
    setDate(agendamento?.date);
    setIsDone(agendamento?.serviceCompleted ? true : false);
    setDateProvided(
      agendamento?.serviceCompleted ? agendamento?.serviceCompleted : null
    );
  }, [agendamento]);
  return (
    <div className="px-8 pt-8">
      {isPending && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="gap-4 flex flex-col bg-ring rounded-xl py-4 px-8"
      >
        <div className="flex flex-col">
          <label className="text-primary-foreground">id</label>
          <input
            readOnly
            disabled
            ref={inputIDRef}
            type="text"
            className="h-8 w-[100px] bg-primary text-primary-foreground py-0 px-2 rounded-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-primary-foreground">Cliente</label>
          <select
            disabled={isUpdate}
            className="h-8 bg-primary text-primary-foreground p-1 rounded-sm"
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(parseInt(e.target.value))}
          >
            <option value={-1}>Selecione um cliente</option>
            {clientes?.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsOpenDialog(true);
            }}
            className="h-8"
          >
            Selecionar veículos
          </Button>
          <Dialog
            open={isOpenDialog}
            onOpenChange={() => setIsOpenDialog(false)}
          >
            <DialogContent className="max-w-[80vw] min-h-[30vh] rounded-xl">
              <DialogHeader></DialogHeader>
              <FormSelectCliente
                veiculos={veiculos}
                setVeiculos={setVeiculos}
                setIsOpenDialog={setIsOpenDialog}
              />
            </DialogContent>
          </Dialog>
          <div className="min-h-8 border-solid border-primary border rounded-lg flex flex-col justify-center mt-2 px-2">
            <h2 className="text-sm uppercase text-gray-600">Veiculos</h2>
            {veiculos.map((veiculo) => (
              <div key={veiculo.id} className="p-1 flex gap-2">
                <p className="text-primary-foreground">{veiculo.id}</p>
                <p className="text-primary-foreground">{veiculo.fabricante}</p>
                <p className="text-primary-foreground">-</p>
                <p className="text-primary-foreground">{veiculo.modelo}</p>
              </div>
            ))}
          </div>
        </div>
        <Popover>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Data</label>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] h-8 justify-start text-left font-normal text-primary-foreground bg-primary border-none",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(date)
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-auto p-0 bg-primary-foreground">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <div className="flex flex-col">
            <label className="text-primary-foreground">
              Data da conclusão do serviço
            </label>
            <div className="flex items-center space-x-2">
              <PopoverTrigger asChild>
                <Button
                  disabled={!isDone}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] h-8 justify-start text-left font-normal text-primary-foreground bg-primary border-none",
                    !dateProvided && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateProvided ? (
                    Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(dateProvided)
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <Checkbox
                checked={isDone}
                onCheckedChange={() => setIsDone(!isDone)}
                id="terms"
                className="border-primary-foreground"
              />
              <label
                htmlFor="terms"
                className="text-primary-foreground text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Serviço efetuado?
              </label>
            </div>
          </div>
          <PopoverContent className="w-auto p-0 bg-primary-foreground">
            <Calendar
              mode="single"
              selected={dateProvided || undefined}
              onSelect={setDateProvided}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
        <div>
          <Button
            disabled={isPending}
            className="w-[100px] bg-primary"
            type="submit"
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgendamentoPage;
