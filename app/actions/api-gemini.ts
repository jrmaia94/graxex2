"use server";

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
const genAI = new GoogleGenerativeAI(apiKey);

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
  if (genAI === undefined) throw new Error("GEMINI_API_KEY is not defined");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  /*   const prompt = `A imagem a seguir deve ser de um veículo do tipo caminhão ou ônibus. Caso não consiga identificar essa imagem como um veículo você vai me responder com "{"code": 400}". Mas se conseguir identificar o veículo, preciso que me diga qual o modelo, a marca, a cor, a empresa e a placa desse veículo. Preciso que retorne essa informações em JSON de linha única onde todas as chaves são no formato string.`; */
  const prompt = `Analisar a imagem anexada e identificar o veículo. Fornecer as informações de acordo com o responseSchema fornecido. Se uma das informações não for encontrada dê o valor "". Responder apenas com o JSON solicitado, sem texto adicional.`;

  model.generationConfig = {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        modelo: {
          type: SchemaType.STRING,
          description: "Modelo do veículo",
          example: "FH 540",
        },
        fabricante: {
          type: SchemaType.STRING,
          description: "Fabricante do veículo",
          example: "Volvo",
        },
        cor: {
          type: SchemaType.STRING,
          description: "Cor do veículo",
          example: "Vermelho",
        },
        empresa: {
          type: SchemaType.STRING,
          description: "Empresa proprietária do veículo",
          example: "Transportes XYZ",
        },
        numero_da_frota: {
          type: SchemaType.STRING,
          description: "Número da frota do veículo",
          example: "123",
        },
        placa: {
          type: SchemaType.STRING,
          description: "Placa do veículo",
          example: "ABC-1234",
        },
      },
    },
  };

  const result = await model.generateContent([prompt, ...imageParts]);

  const response = result.response;
  console.log(response);
  const json = response
    .text()
    .toString()
    .replace(/^```json|```$/g, "");
  console.log(json);
  return json;
}
