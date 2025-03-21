"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
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
  FormDescription,
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
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import { useState } from "react";
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

const FormSchema = z.object({
  id: z.number().default(0),
  clienteId: z.number({
    required_error: "Selecione um cliente.",
  }),
  date: z
    .date({
      required_error: "Selecione uma data.",
    })
    .default(new Date()),
  paymentMethod: z.string().optional(),
});

interface FormAgendamentoProps {
  clientes: Cliente[];
}

export function FormAgendamento({ clientes }: FormAgendamentoProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isSavedAgendamento, setIsSaveAgendamento] = useState<boolean>(true);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createPartialAgendamento({
      clienteId: data.clienteId,
      date: data.date,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="flex flex-col w-full gap-2">
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
                    className="bg-primary w-fit"
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
                    <PopoverContent className="w-[200px] p-0">
                      <Command
                        filter={(value, search) => {
                          if (
                            value.toUpperCase().includes(search.toUpperCase())
                          )
                            return 1;
                          return 0;
                        }}
                      >
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {clientes.map((cliente) => (
                              <CommandItem
                                value={cliente.name}
                                key={cliente.id}
                                onSelect={() => {
                                  form.setValue("clienteId", cliente.id);
                                  setIsPopoverOpen(false);
                                }}
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-primary text-primary-foreground">
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
          <Button type="submit">Salvar</Button>
        </form>
      </Form>
      <ScrollArea
        className={cn(
          "h-72 bg-primary w-full rounded-md px-2",
          !isSavedAgendamento && "opacity-30"
        )}
      >
        <h3 className="text-primary-foreground">Veículos</h3>
      </ScrollArea>
    </div>
  );
}
