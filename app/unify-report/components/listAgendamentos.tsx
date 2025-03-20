import { Checkbox } from "@/components/ui/checkbox";
import { Prisma } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ListAgendamentos = ({
  agendamentos,
  setSelectedAgendamentos,
}: {
  agendamentos: Prisma.AgendamentoGetPayload<{
    include: { veiculos: { include: { veiculo: true } } };
  }>[];
  setSelectedAgendamentos: Dispatch<
    SetStateAction<
      Prisma.AgendamentoGetPayload<{
        include: { veiculos: { include: { veiculo: true } } };
      }>[]
    >
  >;
}) => {
  const [selection, setSelection] = useState<
    Prisma.AgendamentoGetPayload<{
      include: { veiculos: { include: { veiculo: true } } };
    }>[]
  >([]);

  useEffect(() => {
    setSelectedAgendamentos(() => selection);
  }, [selection, setSelectedAgendamentos]);

  function sortAgendamentos(
    array: Prisma.AgendamentoGetPayload<{
      include: { veiculos: { include: { veiculo: true } } };
    }>[]
  ) {
    return array.sort((a, b) => {
      if (a.serviceCompleted && b.serviceCompleted) {
        if (new Date(a.serviceCompleted) > new Date(b.serviceCompleted))
          return -1;
        return 1;
      }
      return 1;
    });
  }

  return (
    <div className="p-2 w-full gap-1 flex flex-col">
      <h3 className="text-primary-foreground font-bold">Agendamentos</h3>
      <div className="text-primary-foreground flex gap-1 items-center pb-1">
        <Checkbox
          onCheckedChange={(isChecked) => {
            if (isChecked) {
              setSelection(agendamentos);
            } else {
              setSelection([]);
            }
          }}
          className="bg-primary text-primary-foreground border-gray-600"
        />
        <span>marcar todos</span>
        <span className="ml-4">
          {selection?.length} de {agendamentos.length} agendamentos selecionados
        </span>
      </div>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-2">
        {sortAgendamentos(agendamentos).map((agendamento) => {
          if (agendamento.serviceCompleted) {
            return (
              <div
                key={agendamento.id}
                className="flex items-center gap-2 w-[185px] h-[50px] bg-primary text-primary-foreground mb-2 rounded-md p-2 text-xs"
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={selection
                      .map((item) => item.id)
                      .includes(agendamento.id)}
                    onCheckedChange={(isCheck) => {
                      if (isCheck) {
                        setSelection((prev) => {
                          const newObj = [...prev, agendamento];
                          return newObj;
                        });
                      } else {
                        setSelection((prev) => {
                          const newObj = prev.filter(
                            (item) => item.id !== agendamento.id
                          );
                          return newObj;
                        });
                      }
                    }}
                    id="terms"
                    className="border border-primary-foreground"
                  />
                </div>
                <div className="flex justify-between gap-1">
                  <p>
                    {Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                    }).format(agendamento.serviceCompleted)}
                  </p>
                  <p> - </p>
                  <p>{agendamento.pricePerVeiculo.length} veículos</p>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ListAgendamentos;
