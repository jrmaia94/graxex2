"use client";
import Loader from "@/components/loader";
import { DataContext } from "@/providers/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { getAllUsers, UserFull } from "../actions/get-users";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CheckCheck, Trash2, User2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="px-4 w-full max-w-[900px]">
        {isPending && <Loader />}
        <Button className="mt-4" asChild>
          <Link href={"/config/users"}>Usuários</Link>
        </Button>
      </div>
    </div>
  );
};

export default PageConfig;
