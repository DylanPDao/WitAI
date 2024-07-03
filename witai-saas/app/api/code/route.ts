import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content: "you are a code generator. You must answer only in markdown code snippets. Add an explanation and steps."
}

export async function POST(req: Request) {
  console.log(req)
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]});
    return NextResponse.json(response.choices[0].message)

  } catch (error) {
    console.error("[CODE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
