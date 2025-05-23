"use client";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const Redirector = ({ children }: { children: ReactNode }) => {
  const { data }: { data: any } = useSession({ required: true });
  const [isClient, setIsClient] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    if (data?.user.typeUser === "CLIENTE") {
      setIsClient(true);
      if (pathname.split("/")[1] !== "cliente") {
        redirect("/cliente");
      }
    } else {
      setIsClient(false);
    }
  }, [data]);

  if (isClient && pathname.split("/")[1] !== "cliente") {
    return <></>;
  } else {
    return <>{children}</>;
  }
};

export default Redirector;
