import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  console.log(req)
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    if (!prompt) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    if (!amount) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    if (!resolution) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const freeTrial = await checkApiLimit()

    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    };

    const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
          });

    if (!isPro) {
      await increaseApiLimit()
    }

    return NextResponse.json(response.data)

  } catch (error) {
    console.error("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
