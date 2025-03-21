import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useSession } from "next-auth/react";
import { FormVeiculo } from "./formVeiculo";
import { ScrollArea } from "../ui/scroll-area";

interface HandleVeiculoProps {
  children: ReactNode;
}

const HandleVeiculo = ({ children }: HandleVeiculoProps) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {data?.user && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="max-w-[95%] h-[90%] rounded-md p-2 m-0">
            <DialogHeader className="text-left">
              <DialogTitle>Cadastro de veículos</DialogTitle>
              <DialogDescription>
                Preencha os informações necessárias ou escolha uma foto pra
                carregar os dados do veículo
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-full">
              <FormVeiculo setIsOpen={setIsOpen} user={data.user} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default HandleVeiculo;
