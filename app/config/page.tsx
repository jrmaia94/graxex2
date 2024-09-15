"use client";
import Loader from "@/components/loader";
import { DataContext } from "@/providers/store";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { getAllUsers, UserFull } from "../actions/get-users";
import { Card, CardContent } from "@/components/ui/card";

const PageConfig = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const router = useRouter();
  const { data: dados } = useContext(DataContext);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<UserFull[]>([]);

  useEffect(() => {
    if (data?.user) {
      if (!data.user.accessLevel.admin) router.push("/");
      startTransition(() => {
        getAllUsers(data.user)
          .then((res: any) => {
            res.forEach((user: UserFull) => {
              if (!user.accessLevel) {
                setUsers((prevObjs) => {
                  const newObjs = [...prevObjs];
                  let localUser = newObjs.find((item) => {
                    return (
                      item.email === user.email ||
                      item.username === user.username
                    );
                  });
                  if (localUser) {
                    localUser.accessLevel = {
                      read: false,
                      create: false,
                      update: false,
                      delete: false,
                      admin: false,
                    };
                  }
                  return newObjs;
                });
              } else {
                setUsers(res);
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, [data, router]);

  return (
    <div className="flex justify-center mt-[90px]">
      <div className="px-4 w-full max-w-[600px]">
        {isPending && <Loader />}
        <div>
          {users?.map((user) => (
            <Card key={user.id} className="w-[400px] p-3">
              <CardContent className="w-full p-0">
                <div className="flex justify-center items-center w-full h-full">
                  <div className="flex flex-col w-[60%]">
                    <p>Nome: {user.name}</p>
                    <p>usuário: {user.username}</p>
                    <p>email: {user.email}</p>
                  </div>
                  <div className="flex flex-col w-[40%]">
                    <p>Permissões</p>
                    {user.accessLevel &&
                      Object.keys(user.accessLevel).map((key, index) => {
                        return (
                          <div key={index}>
                            <input
                              type="checkbox"
                              name="read"
                              id="read"
                              checked={user.accessLevel.read}
                            />
                            <label htmlFor="read">{key}</label>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageConfig;
