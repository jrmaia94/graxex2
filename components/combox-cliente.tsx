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
import { Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import { Cliente } from "@prisma/client";

export function ComboboxClientes({
  clientes,
  selectedCliente,
  setSelectedCliente,
  disabled,
  className,
}: {
  clientes: Cliente[];
  selectedCliente: number;
  setSelectedCliente: Dispatch<SetStateAction<number>>;
  disabled?: boolean;
  className?: HTMLAttributes<HTMLButtonElement>["className"];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    selectedCliente > 0 ? selectedCliente.toString() : null
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled || false}
          variant="default"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? clientes.find((cliente) => cliente.id.toString() === value)?.name
            : "Selecione um cliente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Procurar cliente..." />
          <CommandList>
            <CommandEmpty>Cliente não encontrado.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.name.toString()}
                  onSelect={(currentValue) => {
                    setValue(cliente.id.toString());
                    setSelectedCliente(cliente.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cliente.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {cliente.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
