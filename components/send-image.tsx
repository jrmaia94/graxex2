"use client";

import { sendImage } from "@/app/actions/api-gemini";
import React, { SetStateAction, useRef, useTransition } from "react";
import Loader from "./loader";
import { toast } from "sonner";
import { Input } from "./ui/input";

const SendImage = ({
  setVeiculoFoto,
}: {
  setVeiculoFoto: SetStateAction<any>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result?.toString().split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  function click() {
    startTransition(async () => {
      const imageParts =
        inputRef.current?.files &&
        (await Promise.all(
          [...Array.from(inputRef.current?.files)].map(fileToGenerativePart)
        ));

      console.log(imageParts);

      imageParts &&
        sendImage(imageParts)
          .then((res) => {
            if (JSON.parse(res).code === 400) {
              toast.error(
                "Não foi possível identificar o veículo na imagem enviada"
              );
            } else {
              setVeiculoFoto(JSON.parse(res));
            }
          })
          .catch((err) => {
            toast.error("Houve um erro no envio da imagem");
            console.log(err);
          });
    });
  }

  return (
    <div className="flex flex-col items-start">
      {isPending && <Loader />}
      <Input
        className="text-primary-foreground bg-primary border-none"
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={click}
      />
    </div>
  );
};

export default SendImage;
