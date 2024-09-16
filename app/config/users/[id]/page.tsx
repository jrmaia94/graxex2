"use client";
import { UserFull } from "@/app/actions/get-users";
import { updateUser } from "@/app/actions/update-user";
import CardUser from "@/components/card-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { typesAccess } from "@/constants/perfil-access";
import { DataContext } from "@/providers/store";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

interface PageEditUserParams {
  params: {
    id: string;
  };
}

const PageEditUser = ({ params }: PageEditUserParams) => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  const { data: dados } = useContext(DataContext);
  const [user, setUser] = useState<UserFull | null>(null);

  const callUpdateUser = () => {
    if (user) {
      console.log(user);
      /*       updateUser(user, data.user)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        }); */
    }
  };

  useEffect(() => {
    if (params) {
      if (data) {
        if (dados) {
          if (dados.users) {
            let localUser = dados.users.find((item) => item.id === params.id);
            if (localUser) {
              let obj = {
                read: false,
                create: false,
                update: false,
                delete: false,
                admin: false,
              };
              setUser({ ...localUser, accessLevel: obj });
            }
          }
        }
      }
    }
  }, [params, data, dados]);
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
                            switch (e.target.id) {
                              case "read":
                                break;

                              default:
                                break;
                            }
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
