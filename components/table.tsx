import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { useEffect, useState } from "react";

interface Atendimento {
  id: number;
  cliente: string;
  data: Date;
  price: number;
}

export function DataTable({ agendamentos }: { agendamentos: any[] }) {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);

  useEffect(() => {
    let dados: Atendimento[] = [];
    agendamentos.forEach((e) => {
      console.log(e.serviceCompleted);
      return dados.push({
        id: e.id,
        cliente: e.cliente.name,
        data: e.serviceCompleted,
        price: e.price,
      });
    });
    setAtendimentos(dados);
  }, [agendamentos]);

  return (
    <Table className="mt-1">
      <TableHeader>
        <TableRow className="bg-primary">
          <TableHead className="w-[100px] text-primary-foreground">
            ID
          </TableHead>
          <TableHead className="text-primary-foreground">Cliente</TableHead>
          <TableHead className="text-primary-foreground">Data</TableHead>
          <TableHead className="text-right text-primary-foreground">
            Valor
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {atendimentos.map((atendimento) => (
          <TableRow key={atendimento.id} className="bg-gray-700">
            <TableCell className="font-medium">{atendimento.id}</TableCell>
            <TableCell>{atendimento.cliente}</TableCell>
            <TableCell>
              {moment(atendimento.data.setUTCHours(8)).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell className="text-right">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(atendimento.price)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              atendimentos.reduce(function (a, b) {
                return a + b.price;
              }, 0)
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
