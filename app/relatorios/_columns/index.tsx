"use client";

import { AgendamentoFull } from "@/app/page";
import { AtendimentoPaidForm } from "@/components/isAtendimentoPaidForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, MoreHorizontal } from "lucide-react";
import moment from "moment";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columnsAtendimentos: ColumnDef<
  Pick<
    AgendamentoFull,
    "id" | "cliente" | "serviceCompleted" | "paymentMethod" | "paid" | "price"
  >
>[] = [
  {
    accessorKey: "id",
    header: () => <div className="flex w-full justify-center">ID</div>,
    cell: ({ row: { original: atendimento } }) => (
      <div className="flex w-full justify-center">{atendimento.id}</div>
    ),
  },
  {
    accessorKey: "cliente",
    header: () => <div className="flex w-full">Cliente</div>,
    cell: ({ row: { original: atendimento } }) => (
      <div className="flex w-full">{atendimento.cliente.name}</div>
    ),
  },
  {
    accessorKey: "serviceCompleted",
    header: "Data",
    cell: ({ row: { original: atendimento } }) => (
      <div className="flex w-full">
        {moment(atendimento.serviceCompleted).format("DD-MM-YYYY")}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Forma de pagamento",
    cell: ({ row: { original: atendimento } }) => (
      <div className="flex w-full">
        {atendimento.paymentMethod?.toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "paid",
    header: "Pago?",
    cell: ({ row: { original: atendimento } }) => (
      <div className="flex w-full">
        <Checkbox
          checked={atendimento.paid}
          onCheckedChange={(e) => console.log(e)}
        />
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Valor",
    cell: ({ row: { original: atendimento } }) => (
      <div>
        {Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(atendimento.price)}
      </div>
    ),
  },
  /*   {
    id: "actions",
    enableHiding: false,
    cell: ({ row: { original: atendimento } }) => {
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="sr-only">Ações</span>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem>Pagamento efetuado</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Atendimento</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <AtendimentoPaidForm
              defaultValues={{
                id: atendimento.id,
                paid: atendimento.paid,
                paymentMethod: atendimento.paymentMethod || "other",
              }}
            />
          </DialogContent>
        </Dialog>
      );
    },
  }, */
];
