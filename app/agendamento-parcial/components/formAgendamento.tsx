"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsUpDown,
  CircleAlertIcon,
  PlusCircle,
  PlusIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Agendamento,
  AgendamentoAlterado,
  Cliente,
  Prisma,
  Veiculo,
} from "@prisma/client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createPartialAgendamento } from "@/app/actions/post-agendamento";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAgendamentoById } from "@/app/actions/get-agendamentos";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Loader from "@/components/loader";
import {
  addVeiculoToAgendamento,
  removeVeiculoToAgendamento,
  updatePartialAgendamento,
} from "@/app/actions/update-agendamento";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import FormObs from "./formObs";
import HandleVeiculo from "@/components/veiculos/handleVeiculo";

const FormSchema = z.object({
  id: z.number(),
  clienteId: z.number({
    required_error: "Selecione um cliente.",
  }),
  date: z.date({
    required_error: "Selecione uma data.",
  }),
  paymentMethod: z.string().optional(),
});

interface FormAgendamentoProps {
  clientes: Cliente[];
  params: {
    id: string;
  };
}

export function FormAgendamento({ clientes, params }: FormAgendamentoProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: 0,
      clienteId: 0,
      date: new Date(),
      paymentMethod: "",
    },
  });
  const { data }: { data: any } = useSession({ required: true });
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [agendamento, setAgendamento] = useState<AgendamentoAlterado | null>(
    null
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isSavedAgendamento, setIsSaveAgendamento] = useState<boolean>(
    !!agendamento
  );
  const [cliente, setCliente] = useState<Prisma.ClienteGetPayload<{
    include: {
      veiculos: {
        include: { agendamentos: { include: { agendamento: true } } };
      };
    };
  }> | null>(null);
  const [filter, setFilter] = useState<string>("");

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (agendamento) {
      startTransition(() => {
        updatePartialAgendamento({
          id: agendamento.id,
          date: data.date,
          paymentMethod: data.paymentMethod ?? null,
        })
          .then((res: any) => {
            setAgendamento(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } else {
      startTransition(() => {
        createPartialAgendamento({
          clienteId: data.clienteId,
          date: data.date,
          paymentMethod: data.paymentMethod ?? null,
        })
          .then((res) => {
            router.push(`/agendamento-parcial/${res.id}`);
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }

  function sortVeiculos(
    veiculos: Prisma.VeiculoGetPayload<{
      include: { agendamentos: { include: { agendamento: true } } };
    }>[]
  ) {
    return veiculos
      .map((veiculo) => {
        const lastAgendamento = veiculo.agendamentos
          .map(
            (item) => item.agendamento.serviceCompleted ?? item.agendamento.date
          )
          .sort((a, b) => {
            if (new Date(a) > new Date(b)) {
              return -1;
            }
            return 1;
          })[0];
        return {
          ...veiculo,
          lastAgendamento,
        };
      })
      .sort((a, b) => {
        if (new Date(a.lastAgendamento) > new Date(b.lastAgendamento)) {
          return 1;
        } else {
          return -1;
        }
      });
  }

  function sendVeiculo(veiculo: Veiculo, agendamentoId: number) {
    startTransition(() => {
      addVeiculoToAgendamento(veiculo, agendamentoId)
        .then(() => {
          toast.success("Veiculo adicionado com sucesso!");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  useEffect(() => {
    startTransition(() => {
      if (parseInt(params.id) !== 0 && data?.user) {
        getAgendamentoById(parseInt(params.id), data.user)
          .then((res: any) => {
            setAgendamento(res);
            setCliente(res.cliente);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, [params, data]);

  const formReset = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      form.reset(data);
    },
    [form]
  );

  useEffect(() => {
    startTransition(() => {
      if (agendamento) {
        formReset({
          id: agendamento.id,
          clienteId: agendamento.clienteId,
          date: agendamento.date,
          paymentMethod: agendamento.paymentMethod ?? "",
        });
        setIsSaveAgendamento(true);
      }
    });
  }, [agendamento, formReset]);

  useEffect(() => {
    if (cliente) {
      sortVeiculos(cliente.veiculos);
    }
  }, [cliente]);

  return (
    <div className="flex flex-col w-full max-w-[700px] h-full gap-2 relative">
      {isPending && <Loader />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    readOnly
                    className="bg-primary text-primary-foreground w-fit"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={Intl.DateTimeFormat("en-CA").format(field.value)}
                    onChange={(e) => {
                      form.setValue(
                        "date",
                        new Date(`${e.target.value}T12:00:00`)
                      );
                    }}
                    type="date"
                    className="bg-primary w-fit text-primary-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Cliente</FormLabel>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="default"
                          role="combobox"
                          className={cn("w-[300px] justify-between")}
                        >
                          {field.value
                            ? clientes.find(
                                (cliente) => cliente.id === field.value
                              )?.name
                            : "Selecione um cliente"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 bg-primary text-primary-foreground">
                      <Command
                        filter={(value, search) => {
                          if (
                            value.toUpperCase().includes(search.toUpperCase())
                          )
                            return 1;
                          return 0;
                        }}
                        className="bg-primary text-primary-foreground"
                      >
                        <CommandInput
                          placeholder="Search..."
                          className="h-9 bg-primary text-primary-foreground placeholder:text-primary-foreground"
                        />
                        <CommandList className="bg-primary text-primary-foreground">
                          <CommandEmpty>
                            Nenhum cliente encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            {clientes.map((cliente) => (
                              <CommandItem
                                value={cliente.name}
                                key={cliente.id}
                                onSelect={() => {
                                  form.setValue("clienteId", cliente.id);
                                  setIsPopoverOpen(false);
                                }}
                                className="bg-primary text-primary-foreground"
                              >
                                {cliente.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    cliente.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pagamento</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-primary text-primary-foreground w-fit min-w-[150px]">
                      <SelectValue placeholder="Selecione um método de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-primary text-primary-foreground">
                    <SelectItem value="pix">Pix</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{!!agendamento ? "Salvar" : "Criar"}</Button>
        </form>
      </Form>
      <ScrollArea
        className={cn(
          "h-80 flex bg-primary text-primary-foreground w-full rounded-md px-2",
          !isSavedAgendamento && "opacity-30"
        )}
      >
        <div className="flex items-center justify-start h-10 gap-2">
          <h3 className="text-primary-foreground font-bold">Veículos</h3>
          <Badge className=" bg-slate-600 text-primary text-xs rounded-full h-6 w-6 flex justify-center items-center">
            {agendamento?.veiculos.length ?? 0}
          </Badge>
        </div>
        <div className="grid grid-cols-[_repeat(auto-fill,_160px)] gap-2 items-center justify-center">
          {agendamento?.veiculos
            .map((item) => ({
              ...item.veiculo,
              obs: agendamento.pricePerVeiculo.find(
                (i) => i.veiculoId === item.veiculoId
              )?.observacao,
            }))
            .map((veiculo) => (
              <Dialog key={veiculo.id}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer p-2 bg-slate-200 gap-2 min-w-[150px] w-fit flex items-center justify-center rounded-md text-sm relative">
                    <p className="text-nowrap rounded-sm p-1">
                      {veiculo.frota}
                    </p>
                    <p className="text-nowrap border rounded-sm p-1">
                      {veiculo.placa}
                    </p>
                    {veiculo.obs && (
                      <CircleAlertIcon className="text-orange-500 w-3 h-3 absolute right-1 top-1" />
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-primary rounded-md gap-2 text-primary-foreground w-[95%] border-none shadow-md">
                  <DialogHeader className="text-left p-0 m-0">
                    <DialogTitle className="font-normal">
                      {veiculo.modelo} - {veiculo.fabricante} - {veiculo.cor}
                    </DialogTitle>
                    <DialogDescription className="text-primary-foreground">
                      Placa: {veiculo.placa}
                    </DialogDescription>
                  </DialogHeader>
                  <FormObs
                    deafaultValues={{
                      observacao: veiculo.obs ?? "",
                      valor:
                        agendamento.pricePerVeiculo.find(
                          (i) => i.veiculoId === veiculo.id
                        )?.price || 0,
                    }}
                    removeVeiculoToAgendamento={removeVeiculoToAgendamento}
                    agendamento={agendamento}
                    veiculo={veiculo}
                  />
                </DialogContent>
              </Dialog>
            ))}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              className={
                "select-none rounded-full w-7 h-7 transition-all bg-sky-500 text-primary hover:cursor-pointer my-1 px-1 absolute right-2 top-1"
              }
              disabled={!isSavedAgendamento}
            >
              <PlusIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card-foreground text-card w-[85%]">
            <SheetHeader className="text-left">
              <SheetTitle className="text-card">Veiculos</SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Selecione os veiculos para adicionar ao agendamento.
              </SheetDescription>
              <Input
                autoFocus={false}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-primary text-primary-foreground my-1"
              />
            </SheetHeader>
            <ScrollArea className="w-full h-[85%] border border-gray-400 rounded-md p-2">
              <div className="flex flex-col gap-1">
                {cliente &&
                  sortVeiculos(cliente.veiculos)
                    .filter(
                      (e) =>
                        !agendamento?.veiculos
                          .map((i) => i.veiculoId)
                          .includes(e.id)
                    )
                    .filter((e) => {
                      if (filter === "") return true;
                      return (
                        e.placa.toUpperCase().includes(filter.toUpperCase()) ||
                        e.fabricante
                          ?.toUpperCase()
                          .includes(filter.toUpperCase()) ||
                        e.modelo.toUpperCase().includes(filter.toUpperCase())
                      );
                    })
                    .map((veiculo) => {
                      const ciclo =
                        veiculo.ciclo > 0
                          ? veiculo.ciclo
                          : cliente.ciclo > 0
                          ? cliente.ciclo
                          : 25;
                      return (
                        <div
                          key={veiculo.id}
                          className="flex items-center p-1 mb-2 bg-slate-200 rounded-md h-fit"
                        >
                          <div className="w-[70%] text-sm">
                            <div className="flex items-center gap-1 truncate text-ellipsis">
                              <span className="text-[0.6rem] text-muted-foreground w-[40px] text-right">
                                Modelo:{" "}
                              </span>
                              <p>{veiculo.modelo}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[0.6rem] text-muted-foreground w-[40px] text-right">
                                Fabr.:{" "}
                              </span>
                              <p>{veiculo.fabricante}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[0.6rem] text-muted-foreground w-[40px] text-right">
                                Placa:{" "}
                              </span>
                              <p className="text-sm">{veiculo.placa}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[0.6rem] text-muted-foreground w-[40px] text-right">
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
                                  ? (Date.now() -
                                      Date.parse(
                                        veiculo.lastAgendamento.toString()
                                      )) /
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
                            <SheetClose asChild>
                              <Button
                                onClick={() => {
                                  if (agendamento) {
                                    sendVeiculo(veiculo, agendamento.id);
                                  }
                                }}
                                className="bg-transparent rounded-full"
                                size="icon"
                              >
                                <PlusCircle />
                              </Button>
                            </SheetClose>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </ScrollArea>
      <div className="fixed bottom-4 right-4 md:absolute md:bottom-0 md:right-0 flex gap-1 items-center bg-primary text-primary-foreground p-2 rounded-md">
        <p>Valor total:</p>
        <span className="text-lg font-bold">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(agendamento?.price || 0)}
        </span>
      </div>
    </div>
  );
}
