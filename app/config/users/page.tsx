"use client";
import Loader from "@/components/loader";
import { DataContext } from "@/providers/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { getAllUsers, UserFull } from "../../actions/get-users";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CheckCheck, Trash2, User2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardUser from "@/components/card-user";
import { read } from "fs";
import { create } from "domain";

const PageConfig = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const router = useRouter();
  const { data: dados, setData } = useContext(DataContext);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<UserFull[]>([]);

  useEffect(() => {
    if (data?.user) {
      if (!data.user.accessLevel.admin) router.push("/");
      startTransition(() => {
        getAllUsers(data.user)
          .then((res: any) => {
            setData((prevObjs) => {
              const newObjs = { ...prevObjs };
              newObjs.users = [...res];
              return newObjs;
            });
            let localUsers: UserFull[] = [];
            res.forEach((user: UserFull) => {
              if (!user.accessLevel) {
                localUsers.push({
                  ...user,
                  accessLevel: {
                    read: false,
                    create: false,
                    update: false,
                    delete: false,
                    admin: false,
                  },
                });
              } else {
                localUsers.push(user);
              }
            });
            setUsers(localUsers);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, [data, router, setData]);

  return (
    <div className="flex justify-center mt-[90px]">
      <div className="px-4 w-full max-w-[900px]">
        {isPending && <Loader />}
        <div className="w-full flex flex-col justify-center items-center">
          {users.map((user) => (
            <CardUser user={user} key={user.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageConfig;
