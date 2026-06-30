"use client";

import { Bot, FileText, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "vi";

type Message = {
  role: "assistant" | "user";
  content: string;
};

type Lead = {
  name: string;
  company: string;
  email: string;
  position: string;
};

type AiRecruiterAssistantProps = {
  locale: Locale;
};

const emptyLead: Lead = {
  name: "",
  company: "",
  email: "",
  position: ""
};

const assistantCopy = {
  en: {
    greeting:
      "Hi, I am Thuan's AI recruiter assistant. You can ask about Growth Marketing experience, projects, skills, certifications, or request the CV.",
    requestLead:
      "Sure. Please leave your full name, company, email, and hiring position so I can send the CV.",
    title: "AI Recruiter Assistant",
    subtitle: "Portfolio knowledge base",
    loading: "Working...",
    placeholders: {
      name: "Full name",
      company: "Company",
      email: "Email",
      position: "Hiring position",
      input: "Ask AI about Thuan..."
    },
    sendCv: "Send CV",
    receiveCv: "Receive CV",
    close: "Close assistant",
    open: "Open AI recruiter assistant",
    send: "Send message"
  },
  vi: {
    greeting:
      "Chào anh/chị, em là AI recruiter assistant của Thuan. Anh/chị có thể hỏi về Growth Marketing, dự án, kỹ năng, chứng chỉ hoặc yêu cầu nhận CV.",
    requestLead:
      "Dạ được ạ. Anh/chị vui lòng để lại họ tên, công ty, email và vị trí tuyển dụng để em gửi CV.",
    title: "AI Recruiter Assistant",
    subtitle: "Dữ liệu từ portfolio",
    loading: "Đang xử lý...",
    placeholders: {
      name: "Họ tên",
      company: "Công ty",
      email: "Email",
      position: "Vị trí tuyển dụng",
      input: "Hỏi AI về Thuan..."
    },
    sendCv: "Gửi CV",
    receiveCv: "Nhận CV",
    close: "Đóng assistant",
    open: "Mở AI recruiter assistant",
    send: "Gửi tin nhắn"
  }
};

export function AiRecruiterAssistant({ locale }: AiRecruiterAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadMode, setLeadMode] = useState(false);
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: assistantCopy.en.greeting }
  ]);
  const t = assistantCopy[locale];

  const canSubmitLead = useMemo(
    () => Object.values(lead).every((value) => value.trim().length > 1),
    [lead]
  );

  useEffect(() => {
    function handleOpenAssistant() {
      setOpen(true);
    }

    window.addEventListener("open-ai-assistant", handleOpenAssistant);
    return () => window.removeEventListener("open-ai-assistant", handleOpenAssistant);
  }, []);

  useEffect(() => {
    setMessages([{ role: "assistant", content: assistantCopy[locale].greeting }]);
    setLead(emptyLead);
    setLeadMode(false);
  }, [locale]);

  async function sendMessage() {
    const message = input.trim();
    if (!message || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");

    if (/(send|request|get|receive|gui|gửi|nhận).{0,16}(cv|resume|profile|ho so|hồ sơ)|(cv|resume).{0,16}(send|request|get|receive|gui|gửi|nhận)/i.test(message)) {
      setLeadMode(true);
      setMessages((current) => [...current, { role: "assistant", content: t.requestLead }]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          locale,
          history: messages.slice(-8)
        })
      });
      const data = (await response.json()) as { answer: string };
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            locale === "vi"
              ? "Mình đang gặp lỗi kết nối một chút. Anh/chị thử hỏi lại giúp mình nhé."
              : "I am having a connection issue. Please try asking again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function requestCv() {
    if (!canSubmitLead || loading) return;
    setLoading(true);
    const response = await fetch("/api/request-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, locale })
    });
    const data = (await response.json()) as { message: string };
    setMessages((current) => [...current, { role: "assistant", content: data.message }]);
    setLead(emptyLead);
    setLeadMode(false);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-soft transition hover:scale-105 dark:bg-paper dark:text-ink"
        aria-label={t.open}
      >
        <Bot size={24} />
      </button>

      {open ? (
        <aside className="fixed bottom-5 right-5 z-50 flex h-[min(460px,calc(100vh-40px))] w-[calc(100vw-40px)] max-w-[360px] flex-col overflow-hidden rounded-lg border border-ink/10 bg-paper shadow-soft dark:border-white/10 dark:bg-[#17191b]">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e4572e] text-white">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-paper">{t.title}</p>
                <p className="text-xs text-ink/60 dark:text-paper/60">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-ink/70 hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-white/10"
              aria-label={t.close}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[86%] rounded-lg px-3 py-2 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-ink text-paper dark:bg-paper dark:text-ink"
                    : "bg-white text-ink dark:bg-white/10 dark:text-paper"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? <p className="text-sm text-ink/60 dark:text-paper/60">{t.loading}</p> : null}

            {!leadMode ? (
              <button
                onClick={() => {
                  setLeadMode(true);
                  setMessages((current) => [
                    ...current,
                    { role: "assistant", content: t.requestLead }
                  ]);
                }}
                className="flex h-10 items-center gap-2 rounded-md border border-[#e4572e]/30 bg-[#e4572e]/10 px-4 text-sm font-semibold text-[#c94420] transition hover:bg-[#e4572e]/15 dark:text-[#ff8a68]"
              >
                <FileText size={16} />
                {t.receiveCv}
              </button>
            ) : null}

            {leadMode ? (
              <div className="space-y-2 rounded-lg border border-ink/10 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                {(["name", "company", "email", "position"] as const).map((field) => (
                  <input
                    key={field}
                    value={lead[field]}
                    onChange={(event) => setLead((current) => ({ ...current, [field]: event.target.value }))}
                    placeholder={t.placeholders[field]}
                    className="h-10 w-full rounded-md border border-ink/10 bg-paper px-3 text-sm text-slate-950 outline-none placeholder:text-slate-500 focus:border-[#e4572e] dark:border-white/10 dark:bg-white dark:text-slate-950"
                  />
                ))}
                <button
                  onClick={requestCv}
                  disabled={!canSubmitLead || loading}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#e4572e] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileText size={16} />
                  {t.sendCv}
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex gap-2 border-t border-ink/10 p-3 dark:border-white/10">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder={t.placeholders.input}
              className="h-11 min-w-0 flex-1 rounded-md border border-ink/10 bg-white px-3 text-sm text-slate-950 outline-none placeholder:text-slate-500 focus:border-[#e4572e] dark:border-white/10 dark:bg-white dark:text-slate-950"
            />
            <button
              onClick={sendMessage}
              className="grid h-11 w-11 place-items-center rounded-md bg-ink text-paper dark:bg-paper dark:text-ink"
              aria-label={t.send}
            >
              <Send size={18} />
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
