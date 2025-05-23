"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { disableAdsForUser, getAdsSituation } from "@/app/actions/update-user";
import Loader from "./loader";

const ViewAds = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      if (data?.user) {
        disableAdsForUser(data.user)
          .then((res) => {
            setVisible(false);
          })
          .catch((err) => {
            setVisible(false);
            console.log(err);
          });
      }
    });
  };

  useEffect(() => {
    startTransition(() => {
      if (data?.user) {
        getAdsSituation(data.user)
          .then((res) => {
            if (res) {
              setVisible(res.viewAds);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, [data]);

  return (
    <>
      {isPending && <Loader />}
      {visible && (
        <div className="absolute z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[70%] h-[80%] md:h-[95%] flex md:flex-row flex-col justify-center items-center bg-black p-10 rounded-lg gap-2">
          <Image src="/meme.jpeg" alt="meme" width={500} height={500} />
          <div className="flex flex-col h-full justify-around">
            <p className="flex justify-center items-center md:text-2xl text-lg bg-black p-2 rounded-lg">
              Eaeee seu viadinho, atualização lançada. Fica ligado aí que mais
              tarde te dou a call da nova funcionalidade
            </p>
            <Button onClick={handleClick} variant={"ghost"}>
              <XIcon />
              Não ver mais isso
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAds;
