import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": `${process.env.DOMAIN}`, 
        "X-Title": "Advokey",                   
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages,
      }),
    });

    const data = await response.json();
    const aiMessage = data?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return NextResponse.json({ message: "AI could not generate a legal reply." }, { status: 200 });
    }

    return NextResponse.json({ message: aiMessage }, { status: 200 });

  } catch (err) {
    console.error("AI Error:", err);
    return NextResponse.json({ message: "Internal error." }, { status: 500 });
  }
}
