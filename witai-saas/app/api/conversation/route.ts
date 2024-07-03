import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
            messages});
    return NextResponse.json(response.choices[0].message)
    console.log(response)
  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
