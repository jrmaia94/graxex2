"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Veiculo } from "@prisma/client";
import { useEffect, useState } from "react";

interface ItemSchema {
  id: string;
  label: string;
}

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const FormSelectCliente = ({
  veiculos,
  setVeiculos,
  setIsOpenDialog,
}: {
  veiculos: Veiculo[];
  setVeiculos: Function;
  setIsOpenDialog: Function;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });
  const [items, setItems] = useState<ItemSchema[]>([]);

  useEffect(() => {
    let dados: ItemSchema[] = [];
    veiculos?.forEach((veiculo) => {
      dados.push({
        id: veiculo.id.toString(),
        label: veiculo.modelo,
      });
    });
    setItems(dados);
  }, [veiculos]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let array: number[] = data.items.map((item) => parseInt(item));
    setVeiculos((veiculos: Veiculo[]) => {
      let newObj = veiculos.filter((veiculo) => array.includes(veiculo.id));
      return newObj;
    });
    setIsOpenDialog(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Selecione os clientes para o agendamento!
                </FormLabel>
                <FormDescription></FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={items.length === 0} type="submit">
          Continuar
        </Button>
      </form>
    </Form>
  );
};

export default FormSelectCliente;
