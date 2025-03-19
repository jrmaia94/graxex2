import { Agendamento } from "@prisma/client";

const ListAgendamentos = ({
  agendamentos,
}: {
  agendamentos: Agendamento[];
}) => {
  function sortAgendamentos(array: Agendamento[]) {
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
    <div className="pt-2 w-full grid grid-cols-2 gap-2 flex-col">
      {sortAgendamentos(agendamentos).map((agendamento) => {
        if (agendamento.serviceCompleted) {
          return (
            <div
              key={agendamento.id}
              className="flex items-center justify-between w-[300px] h-[80px] bg-primary text-primary-foreground mb-2 rounded-md p-4"
            >
              <p>{agendamento.id}</p>
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
