"use client";
import { getAllClientes } from "@/app/actions/get-clientes";
import { getAllUsers, UserFull } from "@/app/actions/get-users";
import { addClienteInUser, updateUser } from "@/app/actions/update-user";
import CardUser from "@/components/card-user";
import { ComboboxClientes } from "@/components/combox-cliente";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { typesAccess } from "@/constants/perfil-access";
import { Cliente, TypeUser, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PageEditUserParams {
  params: {
    id: string;
  };
}

const PageEditUser = ({ params }: PageEditUserParams) => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const [user, setUser] = useState<UserFull | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [typeUser, setTypeUser] = useState<string>("CLIENTE");
  const [selectedCliente, setSelectedCliente] = useState<number>(-1);

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

      addClienteInUser(selectedCliente, localUser.id, data.user)
        .then((res) => {
          console.log(res);
          toast.success("Cliente vinculado com sucesso!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Erro ao vincular cliente ao usuário!");
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
                <ComboboxClientes
                  disabled={typeUser !== "CLIENTE"}
                  selectedCliente={selectedCliente}
                  setSelectedCliente={setSelectedCliente}
                  clientes={clientes}
                />
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
