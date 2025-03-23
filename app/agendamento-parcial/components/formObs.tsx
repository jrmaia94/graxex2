"use client";

import { addObsToAgendamento } from "@/app/actions/update-agendamento";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Agendamento, AgendamentoAlterado, Veiculo } from "@prisma/client";
import { Dispatch, SetStateAction, startTransition } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  observacao: z.string(),
  valor: z.number(),
});

const FormObs = ({
  veiculo,
  agendamento,
  deafaultValues,
  removeVeiculoToAgendamento,
}: {
  veiculo: Veiculo;
  deafaultValues: {
    observacao: string;
    valor: number;
  };
  agendamento: AgendamentoAlterado;
  removeVeiculoToAgendamento: (
    veiculo: Veiculo,
    agendamento: AgendamentoAlterado
  ) => Promise<{
    veiculoRemoved: {
      veiculoId: number;
      agendamentoId: number;
    };
    agendamentoUpdated: Agendamento;
  }>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: deafaultValues ?? {
      observacao: "",
      valor:
        agendamento.pricePerVeiculo.find((i) => i.veiculoId === veiculo.id)
          ?.price ?? calculatePrice(veiculo.numEixos),
    },
  });

  function calculatePrice(eixos: number) {
    switch (eixos) {
      case 9:
        return 110;
      case 8:
        return 100;
      case 7:
        return 90;
      case 6:
        return 80;
      case 5:
        return 75;
      case 4:
        return 70;
      case 3:
        return 60;
      case 2:
        return 50;
      default:
        return 50;
    }
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    startTransition(() => {
      addObsToAgendamento(agendamento, veiculo, data.observacao, data.valor)
        .then(() => {
          toast.success("Atendimento atualizado com sucesso!");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    form.setValue("observacao", e.target.value);
                    if (e.target.value.length === 0) {
                      form.setValue("valor", calculatePrice(veiculo.numEixos));
                    }
                    if (e.target.value.length >= 1) {
                      form.setValue(
                        "valor",
                        calculatePrice(veiculo.numEixos) +
                          (parseInt(e.target.value[0]) * 10 || 0)
                      );
                    }
                  }}
                  type="text"
                  className="bg-primary text-primary-foreground"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full flex justify-between items-center mt-2">
                Valor
              </FormLabel>
              <FormControl>
                <NumericFormat
                  {...field}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  className="bg-primary text-primary-foreground w-[150px] text-right border border-primary-foreground rounded-md py-2 px-3"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogFooter className="flex w-full justify-end flex-row gap-2 mt-4">
          <DialogClose asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                startTransition(() => {
                  removeVeiculoToAgendamento(veiculo, agendamento);
                });
              }}
              variant="destructive"
              className="w-[100px]"
            >
              Remover
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" variant="secondary" className="w-[100px]">
              Salvar
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default FormObs;
