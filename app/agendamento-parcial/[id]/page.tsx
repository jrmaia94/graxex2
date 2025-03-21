import { Agendamento } from "@prisma/client";
import { getAllClientesForUnifyReport } from "../../actions/get-clientes";
import { FormAgendamento } from "../components/formAgendamento";
import { prisma } from "@/lib/prisma";

const AgendamentoParcialPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const clientes = await getAllClientesForUnifyReport();
  return (
    <>
      <FormAgendamento params={params} clientes={clientes} />
    </>
  );
};

export default AgendamentoParcialPage;
