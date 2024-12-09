"use client";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useTransition } from "react";
import Loader from "./loader";
import { AgendamentoFull, ClienteFull, VeiculoFull } from "@/app/page";

const formSchema = z.object({
  param: z.string().trim(),
});

const Search = ({
  state,
  action,
  origin,
}: {
  state: any[];
  action: Dispatch<SetStateAction<any[]>>;
  origin: string;
}) => {
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
    const value = formData.param;
    if (data?.user) {
      startTransition(() => {
        switch (origin) {
          case "clientes":
            action(() => {
              return state.filter((e) =>
                e.name.toLowerCase().includes(value.toLowerCase())
              );
            });
            break;
          case "veiculos":
            action(() => {
              return state.filter(
                (e) =>
                  e.cliente.name.toLowerCase().includes(value.toLowerCase()) ||
                  e.modelo.toLowerCase().includes(value.toLowerCase()) ||
                  e.placa.toLowerCase().includes(value.toLowerCase()) ||
                  e.fabricante.toLowerCase().includes(value.toLowerCase())
              );
            });
            break;
          case "agendamentos":
            action(() => {
              return state.filter((e) =>
                e.cliente.name.toLowerCase().includes(value.toLowerCase())
              );
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
