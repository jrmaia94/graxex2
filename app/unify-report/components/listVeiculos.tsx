import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Prisma, Veiculo } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ListVeiculos = ({
  selectedAgendamentos,
  setSelectedVeiculos,
}: {
  setSelectedVeiculos: Dispatch<SetStateAction<Veiculo[]>>;
  selectedAgendamentos: Prisma.AgendamentoGetPayload<{
    include: { veiculos: { include: { veiculo: true } } };
  }>[];
}) => {
  const [selection, setSelection] = useState<Veiculo[] | null>(null);

  const sortVeiculos = (
    array: Prisma.AgendamentoGetPayload<{
      include: { veiculos: { include: { veiculo: true } } };
    }>[]
  ) => {
    const veiculos: { date: Date; veiculo: Veiculo }[] = [];
    array.forEach((item) => {
      if (item.serviceCompleted) {
        const date = new Date(item.serviceCompleted);
        item.veiculos.forEach((e) =>
          veiculos.push({ date: date, veiculo: e.veiculo })
        );
      }
    });

    veiculos.sort((a, b) => {
      if (a.veiculo.placa < b.veiculo.placa) {
        return -1;
      }
      if (a.veiculo.placa > b.veiculo.placa) {
        return 1;
      }
      return 0;
    });

    return veiculos;
  };

  useEffect(() => {
    if (selection) {
      setSelectedVeiculos(selection);
    }
  }, [selection, setSelectedVeiculos]);
  return (
    <div className="p-2">
      <h3 className="text-primary-foreground font-bold">Veículos</h3>
      <div className="text-primary-foreground flex gap-1 items-center pb-1">
        <Checkbox
          onCheckedChange={(isChecked) => {
            if (isChecked) {
              setSelection(() => {
                const items: Veiculo[] = [];
                selectedAgendamentos.forEach((item) =>
                  item.veiculos.forEach((e) => items.push(e.veiculo))
                );
                return items;
              });
            } else {
              setSelection([]);
            }
          }}
          className="bg-primary text-primary-foreground border-gray-600"
        />
        <span>marcar todos</span>
        <span className="ml-4">
          {selection?.length} de {sortVeiculos(selectedAgendamentos).length}{" "}
          veículos selecionados
        </span>
      </div>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 justify-items-center gap-2">
        {sortVeiculos(selectedAgendamentos).map((item, index) => {
          return (
            <div
              key={item.veiculo.id && index}
              className="flex items-center justify-between w-[210px] h-[50px] bg-primary text-primary-foreground mb-2 rounded-md p-4 text-sm"
            >
              <Checkbox
                className="bg-primary text-primary-foreground border-gray-600"
                checked={
                  selection?.map((e) => e.id).includes(item.veiculo.id) ?? false
                }
                onCheckedChange={(isChecked) => {
                  if (isChecked) {
                    setSelection((prev) => {
                      if (prev) {
                        const newObj = [...prev, item.veiculo];
                        return newObj;
                      } else {
                        return [item.veiculo];
                      }
                    });
                  } else {
                    setSelection((prev) => {
                      if (prev) {
                        const newObj = prev.filter(
                          (e) => e.id !== item.veiculo.id
                        );
                        return newObj;
                      } else {
                        return [];
                      }
                    });
                  }
                }}
              />
              <p>{item.veiculo.placa}</p>
              <p>
                {Intl.DateTimeFormat("pt-br", { dateStyle: "short" }).format(
                  item.date
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListVeiculos;
