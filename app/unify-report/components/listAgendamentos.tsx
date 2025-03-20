import { Checkbox } from "@/components/ui/checkbox";
import { Agendamento, Prisma } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

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
    <div className="pt-2 w-full grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 justify-start gap-2">
      {sortAgendamentos(agendamentos).map((agendamento) => {
        if (agendamento.serviceCompleted) {
          return (
            <div
              key={agendamento.id}
              className="flex items-center justify-between w-[220px] h-[50px] bg-primary text-primary-foreground mb-2 rounded-md p-4"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(isCheck) => {
                    if (isCheck) {
                      setSelectedAgendamentos((prev) => {
                        const newObj = [...prev, agendamento];
                        return newObj;
                      });
                    } else {
                      setSelectedAgendamentos((prev) => {
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
              <p>
                {Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
                  agendamento.serviceCompleted
                )}
              </p>
              <p>{agendamento.pricePerVeiculo.length} veículos</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ListAgendamentos;
