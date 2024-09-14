"use client";
import { getClienteById } from "@/app/actions/get-clientes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createCliente } from "@/app/actions/post-cliente";
import { updateCliente, UpdateCliente } from "@/app/actions/update-cliente";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import { DataContext } from "@/providers/store";

interface ClientePageProps {
  params: {
    id: string | number;
  };
}

const ClientePage = ({ params }: ClientePageProps) => {
  // Garantir que tenha usuário logado
  const { data }: { data: any } = useSession({
    required: true,
  });
  const { data: dados, setData } = useContext(DataContext);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [cliente, setCliente] = useState<UpdateCliente>();

  // Controle do formulário
  const inputIDRef = useRef<any>(null);
  const inputNameRef = useRef<any>(null);
  const inputDocumentRef = useRef<any>(null);
  const inputAddressRef = useRef<any>(null);
  const inputPhoneRef = useRef<any>(null);
  const inputFileRef = useRef<any>(null);
  const [typeOfDoc, setTypeOfDoc] = useState("cnpj");
  const [maskDoc, setMaskDoc] = useState("999.999.999-99");

  // Lida com a alternância da máscara do tipo de documento
  const handleTypeDocument = (e: any) => {
    e.target.value === "cpf" && setTypeOfDoc("cpf");
    e.target.value === "cnpj" && setTypeOfDoc("cnpj");
  };

  // Lida com o envio do formulário
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Limpa espaços e transforma "" em null
    const clearFields = (field: string) => {
      if (field === "") {
        return null;
      } else {
        return field.trim().replace(/\s+/g, " ");
      }
    };

    // Efetuando cadastro
    startTransition(() => {
      const cadCliente = {
        name: clearFields(inputNameRef.current?.value) || "",
        address: clearFields(inputAddressRef.current?.value),
        CPFCNPJ: clearFields(inputDocumentRef.current?.value),
        phone: clearFields(inputPhoneRef.current?.value),
        //image: inputFileRef.current?.value,
      };

      if (params.id === "create" && data.user) {
        createCliente(cadCliente, data.user)
          .then((res) => {
            setData((prevData) => {
              const newData = { ...prevData };
              if (!newData.clientes.find((item) => item.id === res.id)) {
                newData.clientes.push({
                  ...res,
                  veiculos: [],
                  agendamentos: [],
                });
              }
              return newData;
            });
            toast.success("Cliente cadastrado com sucesso!");
            setTimeout(() => {
              router.push(`/clientes/${res.id}`);
            }, 300);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ao cadastrar cliente!");
          });
      } else if (data.user && params.id !== "create") {
        updateCliente(
          { id: parseInt(params.id.toString()), ...cadCliente },
          data.user
        )
          .then((res) => {
            let preventRepeat = 0;
            setData((prevData) => {
              preventRepeat += 1;
              const newData = { ...prevData };
              if (!(preventRepeat > 1)) {
                let index = newData.clientes.findIndex(
                  (item) => item.id === res.id
                );
                newData.clientes.splice(index, 1, {
                  ...res,
                  veiculos: [...prevData.clientes[index].veiculos],
                  agendamentos: [...prevData.clientes[index].agendamentos],
                });
              }
              return newData;
            });
            toast.success("Cliente atualizado!");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ao atualizar o cliente!");
          });
      }
    });
  };

  // Lida com o carregamento da página com parâmetros
  useEffect(() => {
    startTransition(() => {
      if (dados && dados.clientes) {
        if (params.id !== "create" && data?.user) {
          let localCliente = dados.clientes.find(
            (item) => item.id === parseInt(params.id.toString())
          );
          localCliente
            ? setCliente(localCliente)
            : toast.error(
                `Não foi possível encontrar o cliente com id ${params.id}!`
              );

          /* getClienteById(parseInt(params.id.toString()), data.user)
            .then((res) => {
              if (!res) toast.info("Cliente não encontrado!");
              if (res) setCliente(res);
              //console.log(res);
            })
            .catch((err) => {
              console.log(err);
            }); */
        }
      }
    });
  }, [params, data, dados]);

  // Atualiza inputs com os dados do cliente encontrado
  useEffect(() => {
    if (cliente) {
      cliente.CPFCNPJ && cliente.CPFCNPJ.length > 14
        ? setTypeOfDoc("cnpj")
        : setTypeOfDoc("cpf");
      inputIDRef.current.value = cliente.id;
      inputNameRef.current.value = cliente.name;
      inputDocumentRef.current.value = cliente.CPFCNPJ || "";
      inputAddressRef.current.value = cliente.address || "";
      inputPhoneRef.current.value = cliente.phone || "";
    }
  }, [cliente]);

  // Lida com a mascara do input CPF/CNPJ
  useEffect(() => {
    typeOfDoc === "cpf" && setMaskDoc("999.999.999-99");
    typeOfDoc === "cnpj" && setMaskDoc("99.999.999/9999-99");
  }, [typeOfDoc]);

  return (
    <div className="flex justify-center mt-[90px]">
      <div className="px-8 pt-8 w-full max-w-[600px]">
        {isPending && <Loader />}
        <form
          onSubmit={() => {}}
          className="gap-4 flex flex-col bg-ring rounded-xl py-4 px-8"
        >
          <div className="flex flex-col">
            <label className="text-primary-foreground">id</label>
            <input
              readOnly
              disabled
              ref={inputIDRef}
              type="text"
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm w-[100px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Nome</label>
            <input
              required
              ref={inputNameRef}
              type="text"
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm"
            />
          </div>
          <div className="gap-1 flex flex-col">
            <RadioGroup value={typeOfDoc} className="flex flex-row">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  className="text-primary-foreground border-primary-foreground"
                  onClick={handleTypeDocument}
                  value="cpf"
                  id="cpf"
                />
                <Label className="text-primary-foreground" htmlFor="cpf">
                  CPF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  className="text-primary-foreground border-primary-foreground"
                  onClick={handleTypeDocument}
                  value="cnpj"
                  id="cnpj"
                />
                <Label className="text-primary-foreground" htmlFor="cnpj">
                  CNPJ
                </Label>
              </div>
            </RadioGroup>
            <InputMask
              ref={inputDocumentRef}
              mask={maskDoc}
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm w-[160px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Endereço</label>
            <input
              ref={inputAddressRef}
              type="text"
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Telefone</label>
            <InputMask
              ref={inputPhoneRef}
              mask="+55(99)99999-9999"
              className="h-8 text-primary-foreground bg-primary p-1 rounded-sm w-[200px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Imagem</label>
            <Input
              disabled
              ref={inputFileRef}
              type="file"
              className="h-8 text-primary-foreground bg-primary border-none p-1"
            />
          </div>
          <div>
            <Button
              disabled={isPending}
              onClick={handleSubmit}
              className="w-[100px] bg-primary"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientePage;
