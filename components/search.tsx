"use client";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { getSomeClientes } from "@/app/actions/get-clientes";
import { toast } from "sonner";
import Link from "next/link";
import { Agendamento, Veiculo } from "@prisma/client";

const formSchema = z.object({
  param: z.string().trim(),
});

const Search = ({ action, origin }: { action: Function; origin: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      param: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    getSomeClientes(data.param)
      .then((res) => {
        // Lidando com os casos de quando o Search é chamado de outras páginas
        switch (origin) {
          case "clientes":
            return action(res);
          case "veiculos":
            let veiculos: Veiculo[] = [];
            res.map((cliente) =>
              cliente.veiculos.map((veiculo) => veiculos.push(veiculo))
            );
            return action(veiculos);
          case "agendamentos":
            let agendamentos: Agendamento[] = [];
            res.map((cliente) => {
              cliente.agendamentos.map((agendamento) =>
                agendamentos.push(agendamento)
              );
            });
            return action(agendamentos);
          default:
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ao buscar clientes!");
      });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="param"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Search"
                  className="bg-primary text-primary-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <SearchIcon />
        </Button>
        <Link href={`/${origin}/create`}>
          <Button>
            <PlusIcon />
          </Button>
        </Link>
      </form>
    </Form>
  );
};

export default Search;
