import Image from "next/image";
import { Avatar } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Trash2, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserFull } from "@/app/actions/get-users";

interface CardUserProps {
  user: UserFull;
}

const CardUser = ({ user }: CardUserProps) => {
  return (
    <Card key={user.id} className="w-[350px] p-3 select-none">
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
  );
};

export default CardUser;
