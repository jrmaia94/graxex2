"use client";
import { getAllUsers, UserFull } from "@/app/actions/get-users";
import { updateUser } from "@/app/actions/update-user";
import CardUser from "@/components/card-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { typesAccess } from "@/constants/perfil-access";
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
      updateUser(localUser, data.user)
        .then((res) => {
          toast.success("Usuário atualizado com sucesso");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Não foi possível atualizar o usuário");
          toast.error(err.message);
        });
    }
  };

  useEffect(() => {
    if (params) {
      if (data?.user) {
        getAllUsers(data.user).then((res) => {
          let localUser = res.find((item) => item.id === params.id);
          if (localUser) {
            console.log(localUser);
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
          }
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
              <div className="flex justify-center h-full gap-6">
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
