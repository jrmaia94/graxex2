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

import { useState } from "react";
import { ClienteWithVeiculosAndAtendimentos } from "../[id]/page";
import { useRouter } from "next/navigation";

export function SearchCliente({
  clientes,
  selectedCliente,
}: {
  clientes: ClienteWithVeiculosAndAtendimentos[];
  selectedCliente: ClienteWithVeiculosAndAtendimentos | null;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between bg-primary text-primary-foreground"
        >
          {selectedCliente && selectedCliente.id
            ? clientes.find((cliente) => cliente.id === selectedCliente.id)
                ?.name
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
                    const clientId = clientes.find(
                      (c) => c.name === currentValue
                    )?.id;
                    router.push(`/unify-report/${clientId}`);
                  }}
                  className="text-primary-foreground"
                >
                  {cliente.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedCliente?.id === cliente.id
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
  );
}
