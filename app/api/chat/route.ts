import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getPortfolioKnowledge, localAnswer, type Locale } from "@/lib/portfolio";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

function detectMessageLocale(message: string, fallback: Locale): Locale {
  const normalized = message.toLowerCase();
  const hasVietnameseCharacters = /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i.test(normalized);
  const vietnameseWords = /\b(?:anh|chị|em|tôi|mình|bạn|của|về|với|cho|thông tin|kinh nghiệm|kỹ năng|dự án|tuyen dung|thuan|gui cv|nhan cv)\b/i;
  const englishWords = /\b(?:hello|hi|please|tell|about|your|his|experience|skills|projects|resume|send|receive|thank|thanks)\b/i;

  if (hasVietnameseCharacters || vietnameseWords.test(normalized)) return "vi";
  if (englishWords.test(normalized)) return "en";
  return fallback;
}

export async function POST(request: Request) {
  const { message, locale = "en", history = [] } = (await request.json()) as {
    message?: string;
    locale?: Locale;
    history?: ChatMessage[];
  };
  const safeLocale: Locale = locale === "vi" ? "vi" : "en";
  const responseLocale = detectMessageLocale(message || "", safeLocale);
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
    return NextResponse.json({ answer: localAnswer(message, responseLocale) });
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
- Detect the language of the user's latest message and reply in that same language.
- If the latest message is too short or language-neutral to identify, continue in ${responseLocale === "vi" ? "Vietnamese" : "English"}.
- The user may switch languages between turns. Follow the latest message naturally.
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
        content: `Interface language: ${safeLocale}. Expected response language for this turn: ${responseLocale}.\nPortfolio knowledge base:\n${getPortfolioKnowledge(responseLocale)}`
      },
      ...safeHistory.map((item) => ({
        role: item.role,
        content: item.content.slice(0, 1200)
      })),
      { role: "user", content: message }
    ]
  });

  return NextResponse.json({
    answer: response.choices[0]?.message.content || localAnswer(message, responseLocale)
  });
}
