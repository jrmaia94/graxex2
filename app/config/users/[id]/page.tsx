"use client";
import { getAllClientes } from "@/app/actions/get-clientes";
import { getAllUsers, UserFull } from "@/app/actions/get-users";
import { addClienteInUser, updateUser } from "@/app/actions/update-user";
import CardUser from "@/components/card-user";
import { ComboboxClientes } from "@/components/combox-cliente";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { typesAccess } from "@/constants/perfil-access";
import { Cliente, Prisma } from "@prisma/client";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PageEditUserParams {
  params: {
    id: string;
  };
}

type UserConfig = Prisma.UserGetPayload<{
  include: {
    clientes: {
      include: {
        cliente: true;
      };
    };
  };
}> &
  UserFull;

const PageEditUser = ({ params }: PageEditUserParams) => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [user, setUser] = useState<UserConfig | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [typeUser, setTypeUser] = useState<string>("CLIENTE");
  const [selectedCliente, setSelectedCliente] = useState<number>(-1);
  const [selectedClientes, setSelectedClientes] = useState<number[]>([]);

  const insertClient = () => {
    setSelectedClientes((prevObj) => {
      const newObj = [...prevObj];
      if (newObj.includes(selectedCliente) || selectedCliente <= 0)
        return newObj;

      newObj.push(selectedCliente);

      return newObj;
    });
  };

  const removeClient = (id: number) => {
    setSelectedClientes((prevObj) => {
      const newObj = [...prevObj];
      const index = newObj.indexOf(id);
      if (index > -1) {
        newObj.splice(index, 1);
      }
      return newObj;
    });
  };

  const callUpdateUser = () => {
    let localUser: any = { ...user };
    if (localUser) {
      if (
        localUser.accessLevel.read ||
        localUser.accessLevel.create ||
        localUser.accessLevel.update ||
        localUser.accessLevel.delete ||
        localUser.accessLevel.admin
      ) {
        localUser.perfil = true;
      } else {
        localUser.perfil = false;
      }
      localUser.typeUser = typeUser;
      updateUser(localUser, data.user)
        .then((res) => {
          toast.success("Usuário atualizado com sucesso");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Não foi possível atualizar o usuário");
          toast.error(err.message);
        });

      addClienteInUser(selectedClientes, localUser.id, data.user)
        .then((res) => {
          console.log(res);
          toast.success("Cliente(s) vinculado(s) com sucesso!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Erro ao vincular cliente(s) ao usuário!");
        });
    }
  };

  useEffect(() => {
    if (params) {
      if (data?.user) {
        getAllUsers(data.user).then((res) => {
          let localUser = res.find((item) => item.id === params.id);
          if (localUser) {
            let obj = {
              read: false,
              create: false,
              update: false,
              delete: false,
              admin: false,
            };
            !localUser.accessLevel
              ? setUser({ ...localUser, accessLevel: obj })
              : setUser({ ...localUser });
            setTypeUser(localUser.typeUser);
          }
        });
        getAllClientes(data.user)
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Não foi possível localizar os clientes");
          });
      }
    }
  }, [params, data]);

  useEffect(() => {
    user?.clientes &&
      setSelectedClientes(user.clientes.map((e) => e.clienteId));
  }, [user]);
  return (
    <div className="mt-[90px] w-full">
      {user && (
        <div className="w-full flex justify-center">
          <Card>
            <CardContent className="p-2">
              <CardUser user={user} />
              <div className="flex flex-col justify-center h-full gap-6">
                <div className="w-[30%]">
                  {typesAccess.map((item: string, index: number) => {
                    return (
                      <div key={index} className="flex items-center h-6 gap-1">
                        <input
                          type="checkbox"
                          id={item}
                          checked={
                            user.accessLevel ? user.accessLevel[item] : false
                          }
                          onChange={(e) => {
                            setUser((prevUser) => {
                              if (prevUser) {
                                const newUser = { ...prevUser };
                                newUser.accessLevel[e.target.id] =
                                  e.target.checked;
                                return newUser;
                              } else {
                                return null;
                              }
                            });
                          }}
                        />
                        <label>{item}</label>
                      </div>
                    );
                  })}
                </div>
                <select
                  value={typeUser}
                  className="h-10 rounded-md text-primary-foreground px-2"
                  onChange={(e) => setTypeUser(e.target.value)}
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="COLABORADOR">Colaborador</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="flex items-center gap-2">
                  <ComboboxClientes
                    disabled={typeUser !== "CLIENTE"}
                    selectedCliente={selectedCliente}
                    setSelectedCliente={setSelectedCliente}
                    clientes={clientes}
                    className="w-full"
                  />
                  <Button
                    size="icon"
                    className="rounded-full w-12 h-10"
                    variant="success"
                    onClick={insertClient}
                  >
                    <PlusIcon />
                  </Button>
                </div>
                <Card className="bg-primary text-primary-foreground px-2 py-1">
                  {clientes
                    .filter((e) => selectedClientes.includes(e.id))
                    .map((e) => {
                      return (
                        <div
                          key={e.id}
                          className="flex p-2 justify-between items-center"
                        >
                          <p>{e.name}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="rounded-full w-7 h-7"
                              >
                                <Trash2Icon size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>
                                Deseja desvincular o cliente do usuário?
                              </DialogTitle>
                              <DialogDescription></DialogDescription>
                              <DialogFooter>
                                <DialogClose className="min-w-[100px]">
                                  Não
                                </DialogClose>
                                <Button
                                  className="min-w-[100px]"
                                  variant="destructive"
                                  onClick={() => removeClient(e.id)}
                                >
                                  Sim
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      );
                    })}
                </Card>
                <div className="flex w-[30%] items-end">
                  <Button size="sm" onClick={callUpdateUser}>
                    Atualizar Usuário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PageEditUser;
