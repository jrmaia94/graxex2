"use client";

import { Check, ChevronsUpDown } from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Cliente, Prisma } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function SearchCliente({
  clientes,
  selectedCliente,
  setSelectedCliente,
}: {
  clientes: Prisma.ClienteGetPayload<{
    include: { veiculos: true };
  }>[];
  selectedCliente: Prisma.ClienteGetPayload<{
    include: { veiculos: true };
  }> | null;
  setSelectedCliente: Dispatch<
    SetStateAction<Prisma.ClienteGetPayload<{
      include: { veiculos: true };
    }> | null>
  >;
}) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>();

  useEffect(() => {
    if (selectedCliente) {
      setId(selectedCliente?.id);
    }
  }, [selectedCliente]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between bg-primary text-primary-foreground"
        >
          {id
            ? clientes.find((cliente) => cliente.id === id)?.name
            : "Selecione um cliente..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command className="bg-primary text-primary-foreground">
          <CommandInput placeholder="Procurar cliente..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.name}
                  onSelect={(currentValue) => {
                    setId(
                      currentValue === id?.toString()
                        ? 0
                        : parseInt(currentValue)
                    );
                    const cliente = clientes.find(
                      (cliente) => cliente.id === id
                    );
                    if (cliente) {
                      setSelectedCliente(cliente);
                      setOpen(false);
                    }
                  }}
                  className="text-primary-foreground"
                >
                  {cliente.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      id === cliente.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
