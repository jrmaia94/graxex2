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
        <div className="w-full flex flex-col justify-center items-center">
          {users.map((user) => (
            <Card key={user.id} className="w-[350px] p-3">
              <CardContent className="w-full p-0 relative">
                <div className="flex justify-start gap-4 items-center w-full h-full">
                  {user.image ? (
                    <Avatar className="w-[70px] h-[70px]">
                      <Image
                        alt="Foto do usuário"
                        src={user.image || ""}
                        width={70}
                        height={70}
                      />
                    </Avatar>
                  ) : (
                    <User2 width={70} height={70} />
                  )}
                  <div>
                    <Link href={`/config/users/${user.id}`}>
                      <p className="text-xl italic text-primary">{user.name}</p>
                    </Link>
                    {user.email ? (
                      <div className="flex items-center">
                        <span className="text-xs ms-1 italic text-secondary-foreground">
                          email:
                        </span>
                        <p className="text-sm ms-1 italic text-secondary-foreground">
                          {user.email}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-xs ms-1 italic text-secondary-foreground">
                          username:
                        </span>
                        <p className="text-sm ms-1 italic text-secondary-foreground">
                          {user.username}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute right-0 top-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent hover:bg-transparent rounded-full hover:text-red-400 hover:scale-105"
                  >
                    <Trash2 />
                  </Button>
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
