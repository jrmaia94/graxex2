"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

const ViewAds = () => {
  const { data }: { data: any } = useSession({
    required: true,
  });

  return (
    <>
      {data?.user.ads && (
        <div className="absolute z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[70%] h-[95%] flex justify-center items-center bg-black p-10 rounded-lg">
          <div className="relative">
            <Image src="/meme.jpeg" alt="meme" width={500} height={500} />
            <p className="absolute z-50 bottom-0 left-[50%] translate-x-[-50%] flex justify-center items-center text-2xl bg-black p-2 rounded-lg">
              Eaeee seu viadinho, atualização lançada. Fica ligado aí que mais
              tarde te dou a call da nova funcionalidade
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAds;
