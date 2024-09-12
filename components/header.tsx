"use client";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon, MenuIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { itemsMenu } from "@/constants/nav-menu";
import ItemMenu from "./item-menu";

const Header = () => {
  const { data } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Card className="border-none h-[90px] z-50 fixed top-0 left-0 w-full bg-gray-800/[.97]">
      <CardContent className="p-5">
        <div className="flex flex-row items-center justify-between">
          <Link href="/">
            <Image
              alt="Logo da graxex"
              src="/logo-horizontal.png"
              width={100}
              height={100}
            />
          </Link>
          <Button
            variant={"ghost"}
            onClick={() => setIsSheetOpen(true)}
            className="md:h-[30px] m:w-[30px] w-[50px] h-[50px] p-0"
          >
            <MenuIcon className="w-full h-full" />
          </Button>
          <Sheet open={isSheetOpen} onOpenChange={(e) => setIsSheetOpen(e)}>
            <SheetContent className="w-[300px]">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <SheetDescription></SheetDescription>
              <div className="flex flex-col pt-4 w-full items-center justify-center">
                {!data?.user ? (
                  <div className="flex flex-col w-full items-center justify-center border-b border-solid pb-4">
                    <div className="pb-6">
                      <Avatar className="w-[70px] h-[70px] bg-primary">
                        <User2Icon
                          size={70}
                          className="text-primary-foreground"
                        />
                      </Avatar>
                    </div>
                    <Button
                      className="gap-x-2 w-[180px]"
                      onClick={() => signIn()}
                    >
                      <LogInIcon />
                      Login
                    </Button>
                    <Button
                      variant="link"
                      asChild
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Link href="/sign-up">Cadastre-se</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col w-full gap-4 items-center justify-center border-primary border-b border-solid pb-5">
                    <Avatar className="w-[70px] h-[70px]">
                      <AvatarImage
                        src={data.user.image || ""}
                        alt={`Avatar de ${data.user.name}`}
                      />
                    </Avatar>
                    <span>{data.user.name}</span>
                    <Button className="gap-x-2" onClick={() => signOut()}>
                      <LogOutIcon />
                      Logout
                    </Button>
                  </div>
                )}
                {itemsMenu.map((item, index) => (
                  <ItemMenu
                    action={setIsSheetOpen}
                    key={index}
                    itemMenu={item}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
