import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const token = process.env.GITHUB_AI_API_KEY;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const client = createOpenAI({ baseURL: endpoint, apiKey: token });

export async function POST(req: Request) {
  try {

    const { prompt }: { prompt: string } = await req.json();

    const model = client(modelName);

    const responseStream = await streamText({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      maxTokens: 1000,
      temperature: 0.5,
    });   

    return responseStream.toDataStreamResponse();

  } catch (error) {
    console.error("The sample encountered an error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An error occured while generating response in suggest-messages route",
        error,
      },
      { status: 500 }
    );
  }
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req: Request): Promise<Response> {
//   try {
//     const { prompt } = await req.json();

//     if (!prompt) {
//       return NextResponse.json(
//         { error: "Prompt is required" },
//         { status: 400 }
//       );
//     }

//     const huggingFaceUrl = "https://api-inference.huggingface.co/models/gpt2"; // Replace with your desired Hugging Face model URL

//     const response = await axios({
//       method: "post",
//       url: huggingFaceUrl,
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       data: {
//         inputs: prompt,
//         options: { use_cache: false, wait_for_model: true },
//       },
//       responseType: "stream",
//     });
//     console.log("response -> ", response);
//     const stream = new ReadableStream({
//       start(controller) {
//         response.data.on("data", (chunk: Buffer) => {
//           controller.enqueue(chunk);
//         });

//         response.data.on("end", () => {
//           controller.close();
//         });

//         response.data.on("error", (error: any) => {
//           console.error(error);
//           controller.error(error);
//         });
//       },
//     });
//     console.log("stream -> ", stream);
//     return new Response(stream, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/octet-stream",
//         "Cache-Control": "no-cache",
//       },
//     });
//   } catch (error: any) {
//     console.error(error.message || error);
//     return NextResponse.json(
//       { error: "Failed to fetch response from Hugging Face API" },
//       { status: 500 }
//     );
//   }
// }
