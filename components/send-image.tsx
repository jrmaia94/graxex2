"use client";

import { sendImage } from "@/app/actions/api-gemini";
import React, { SetStateAction, useRef, useState, useTransition } from "react";
import Loader from "./loader";
import { toast } from "sonner";
import { Input } from "./ui/input";
import imageCompression from "browser-image-compression";

const SendImage = ({
  setVeiculoFoto,
}: {
  setVeiculoFoto: SetStateAction<any>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState("");

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

  async function click(e: any) {
    startTransition(async () => {
      const imageFile = e.target.files[0];

      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        const imageParts = await Promise.all(
          [compressedFile].map(fileToGenerativePart)
        );
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
      } catch (error) {
        toast.error("Ocorreu um erro na compressão da imagem");
        console.log(error);
      }
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
