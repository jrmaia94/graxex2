"use client";
import { CalendarIcon, PlusIcon, SearchIcon } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { groupAgendamentosByClient } from "@/lib/groupAgendamentos";

const formSchema = z.object({
  param: z.string().trim(),
  data: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
});

const Search = ({
  state,
  action,
  origin,
  filterIsPaid,
}: {
  state: any[];
  action: Dispatch<SetStateAction<any[]>>;
  origin: string;
  filterIsPaid?: boolean;
}) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      param: "",
      data: {
        to: new Date(new Date().setHours(23, 59, 59, 0)),
        from: new Date(new Date(Date.now()).setHours(0, 0, 0, 0)),
      },
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
            console.log(state);
            action(() => {
              return state.filter(
                (e) =>
                  e.cliente.name.toLowerCase().includes(value.toLowerCase()) ||
                  e.modelo.toLowerCase().includes(value.toLowerCase()) ||
                  e.placa.toLowerCase().includes(value.toLowerCase()) ||
                  e.fabricante?.toLowerCase().includes(value.toLowerCase())
              );
            });
            break;
          case "agendamentos":
            action(() => {
              return groupAgendamentosByClient(
                state
                  .filter(
                    (e) =>
                      e.cliente.name
                        .toLowerCase()
                        .includes(value.toLowerCase()) &&
                      new Date(e.serviceCompleted) >=
                        new Date(formData.data.from.setHours(0, 0, 0, 0)) &&
                      new Date(e.serviceCompleted) <=
                        new Date(
                          formData.data.to
                            ? formData.data.to.setHours(23, 59, 59, 0)
                            : formData.data.from.setHours(23, 59, 59, 0)
                        )
                  )
                  .filter((e) => (filterIsPaid ? e.paid === false : true))
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
        className="flex gap-2 w-full items-end"
      >
        <div className="flex flex-col gap-2 w-full">
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
          {origin === "agendamentos" && (
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-muted-foreground">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value?.from ? (
                            field.value?.to ? (
                              <>
                                {format(field.value.from, "dd/MM/yy")} -{" "}
                                {format(field.value.to, "dd/MM/yy")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
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
