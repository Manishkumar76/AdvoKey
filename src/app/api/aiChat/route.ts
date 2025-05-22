import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: "Invalid request format." }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.DOMAIN ?? "",
        "X-Title": "Advokey",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", errorText);
      return NextResponse.json({ message: "Failed to get AI response." }, { status: response.status });
    }

    const data = await response.json();
    const aiMessage = data?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return NextResponse.json({ message: "AI could not generate a legal reply." }, { status: 200 });
    }

    return NextResponse.json({ message: aiMessage }, { status: 200 });

  } catch (err: any) {
    console.error("Internal Error:", err.message || err);
    return NextResponse.json({ message: "Internal error occurred." }, { status: 500 });
  }
}
