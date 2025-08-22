"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const genAI: any =
  process.env.GEMINI_API_KEY &&
  new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts a File object to a GoogleGenerativeAI.Part object.
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

export async function sendImage(imageParts: any[]) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

  /*   const prompt = `A imagem a seguir deve ser de um veículo do tipo caminhão ou ônibus. Caso não consiga identificar essa imagem como um veículo você vai me responder com "{"code": 400}". Mas se conseguir identificar o veículo, preciso que me diga qual o modelo, a marca, a cor, a empresa e a placa desse veículo. Preciso que retorne essa informações em JSON de linha única onde todas as chaves são no formato string.`; */
  const prompt = `Analisar a imagem anexada e identificar o veículo. Se for um caminhão ou ônibus, fornecer as seguintes informações em formato JSON escrito em linha única: modelo, fabricante, cor, empresa, numero_da_frota e placa. Se uma dessas informações não for encontrada dê o valor "". Caso não consiga identificar essa imagem como um veículo você vai me responder com "{"code": 400}"`;

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const json = response
    .text()
    .toString()
    .replace(/^```json|```$/g, "");
  console.log(json);
  return json;
}
