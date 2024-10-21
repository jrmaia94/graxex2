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
import { useSession } from "next-auth/react";
import { getSomeVeiculos } from "@/app/actions/get-veiculos";
import { useTransition } from "react";
import Loader from "./loader";

const formSchema = z.object({
  param: z.string().trim(),
});

const Search = ({ action, origin }: { action: Function; origin: string }) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      param: "",
    },
  });

  const handleSubmit = (formData: z.infer<typeof formSchema>) => {
    if (data?.user) {
      startTransition(() => {
        switch (origin) {
          case "clientes":
            getSomeClientes(formData.param, data.user)
              .then((res) => {
                return action(res);
              })
              .catch((err) => {
                console.log(err);
                toast.error("Não foi possível buscar os clientes");
              });
            break;
          case "veiculos":
            getSomeVeiculos(formData.param, data.user)
              .then((res) => {
                return action(res);
              })
              .catch((err) => {
                console.log(err);
                toast.error("Não foi possível buscar os veículos");
              });
            break;
          case "agendamentos":
            getSomeClientes(formData.param, data.user)
              .then((res) => {
                let agendamentos: Agendamento[] = [];
                res.map((cliente) => {
                  cliente.agendamentos.map((agendamento) =>
                    agendamentos.push(agendamento)
                  );
                });
                return action(agendamentos);
              })
              .catch((err) => {
                console.log(err);
                toast.error("Não foi possível buscar os clientes");
              });
            break;
          default:
            break;
        }
      });
    }
  };
  return (
    <Form {...form}>
      {isPending && <Loader />}
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-2 w-full"
      >
        <FormField
          control={form.control}
          name="param"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  disabled={origin === "agendamentos"}
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
