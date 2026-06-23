import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getPortfolioKnowledge, localAnswer, type Locale } from "@/lib/portfolio";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

export async function POST(request: Request) {
  const { message, locale = "en", history = [] } = (await request.json()) as {
    message?: string;
    locale?: Locale;
    history?: ChatMessage[];
  };
  const safeLocale: Locale = locale === "vi" ? "vi" : "en";
  const safeHistory = history
    .filter(
      (item): item is ChatMessage =>
        (item.role === "assistant" || item.role === "user") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
    )
    .slice(-8);

  if (!message?.trim()) {
    return NextResponse.json({
      answer:
        safeLocale === "vi"
          ? "Anh/chị muốn hỏi thêm thông tin nào về Thuan ạ?"
          : "What would you like to know about Thuan?"
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ answer: localAnswer(message, safeLocale) });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.75,
    presence_penalty: 0.25,
    messages: [
      {
        role: "system",
        content: `You are Thuan's portfolio AI assistant.

Style:
- Reply in ${safeLocale === "vi" ? "natural Vietnamese" : "natural English"}.
- Sound warm, direct, and conversational, like a helpful assistant in a chat window.
- Do not repeat a fixed greeting after the first turn.
- Do not sound like a script, brochure, or FAQ page.
- Keep most answers to 2-4 short sentences. Use bullets only when the user asks for a list or the answer is easier to scan.
- If the user asks a broad question such as "thong tin cua Thuan", summarize the most useful profile points first, then invite one focused follow-up.

Rules:
- Use only the portfolio knowledge base. Do not invent employers, dates, metrics, or tools.
- If a field says update/placeholder, say it needs confirmation from the latest CV.
- If the user clearly wants the CV sent to them, ask for full name, company, email, and hiring position.
- If the user says "no", "ko", or declines, continue naturally and offer another useful angle without pushing CV.`
      },
      {
        role: "system",
        content: `Selected language: ${safeLocale}\nPortfolio knowledge base:\n${getPortfolioKnowledge(safeLocale)}`
      },
      ...safeHistory.map((item) => ({
        role: item.role,
        content: item.content.slice(0, 1200)
      })),
      { role: "user", content: message }
    ]
  });

  return NextResponse.json({
    answer: response.choices[0]?.message.content || localAnswer(message, safeLocale)
  });
}
