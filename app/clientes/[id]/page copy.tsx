"use client";
import { getClienteById } from "@/app/actions/get-clientes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cliente } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    id: z.string(),
    CPFCNPJ: z.string(),
    address: z.string(),
    createdAt: z.date(),
    imageUrl: z.string(),
    name: z.string().min(4),
    phone: z.string(),
    updatedAt: z.date(),
  })
  .partial({
    CPFCNPJ: true,
    address: true,
    phone: true,
    imageUrl: true,
  });

export type FormSchema = z.infer<typeof formSchema>;

interface ClientePageProps {
  params: {
    id: string;
  };
}

const ClientePage = ({ params }: ClientePageProps) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [cliente, setCliente] = useState<Cliente>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {
    console.log("teste");

    startTransition(async () => {
      try {
        console.log(data);
        toast.success("User created successfully");
      } catch (error) {
        toast.error("An error occurred while creating the user");
        console.error(error);
      }
    });
  };

  useEffect(() => {
    if (cliente) {
      form.setValue("name", cliente.name);
      cliente.CPFCNPJ && form.setValue("CPFCNPJ", cliente.CPFCNPJ);
      form.setValue("address", cliente.address || "");
      form.setValue("phone", cliente.phone || "");
    }
  }, [cliente]);

  useEffect(() => {
    params.id !== "create" &&
      getClienteById(params.id)
        .then((res) => {
          if (!res) toast.info("Cliente não encontrado!");
          if (res) setCliente(res);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Ocorreu um erro na buscar do cliente!");
        });
  }, [params]);
  return (
    <div className="px-8 pt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-secondary-foreground text-secondary"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CPFCNPJ"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input
                    className="bg-secondary-foreground text-secondary w-[250px]"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    className="bg-secondary-foreground text-secondary"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    className="bg-secondary-foreground text-secondary w-[200px]"
                    type="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <Input
                    className="bg-secondary-foreground text-secondary w-[400px]"
                    placeholder="Password (min 8 characters)"
                    type="file"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4 w-[150px]" type="submit" disabled={isPending}>
            Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ClientePage;
