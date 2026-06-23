"use client";

import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Download,
  ExternalLink,
  Facebook,
  FileText,
  Linkedin,
  Mail,
  MessageCircle,
  Sparkles,
  Target,
  Users,
  Workflow
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import portfolioEn from "@/data/portfolio.json";
import portfolioVi from "@/data/portfolio.vi.json";
import { AiRecruiterAssistant } from "@/components/AiRecruiterAssistant";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Section } from "@/components/Section";
import { ThemeToggle } from "@/components/ThemeToggle";

const competencyIcons = [
  Target,
  Users,
  BarChart3,
  BriefcaseBusiness,
  BarChart3,
  FileText,
  Sparkles,
  Building2,
  Workflow,
  BarChart3
];

type Locale = "en" | "vi";

const copy = {
  en: {
    nav: ["About", "Skills", "Journey", "Projects", "Contact"],
    heroPill: "Growth systems, community loops, product stories",
    downloadCv: "Download CV",
    chatWithAi: "Chat With AI",
    stats: ["Core skills", "Featured projects", "Recruiter ready"],
    scrollAbout: "Scroll to about",
    aboutEyebrow: "About Me",
    aboutTitle: "Growth marketing with product sense.",
    competenciesEyebrow: "Core Competencies",
    competenciesTitle: "Skills recruiters can scan fast.",
    journeyEyebrow: "Career Journey",
    journeyTitle: "A timeline built around measurable learning.",
    projectsEyebrow: "Featured Projects",
    projectsTitle: "Work samples shaped like growth cases.",
    goal: "Goal",
    result: "Result",
    kpi: "KPI",
    certificationsEyebrow: "Certifications",
    certificationsTitle: "Credentials and focused learning.",
    contactEyebrow: "Contact",
    contactTitle: "Ready for a recruiter conversation.",
    contactIntro:
      "For Product Marketing, Growth Marketing, Community Growth, or AI-enabled marketing roles, reach out directly or use the AI assistant to request CV delivery.",
    recruiterFlow: "Recruiter Flow",
    recruiterFlowTitle: "Ask the AI, leave contact details, receive CV.",
    recruiterFlowBody:
      "The assistant can collect recruiter name, company, email, and hiring position, then pass the lead to an n8n webhook for Google Sheet logging, email notification, and automated CV delivery.",
    contactNow: "Contact Now",
    footer: "Growth Marketing Portfolio."
  },
  vi: {
    nav: ["Giới thiệu", "Kỹ năng", "Hành trình", "Dự án", "Liên hệ"],
    heroPill: "Hệ thống tăng trưởng, cộng đồng, câu chuyện sản phẩm",
    downloadCv: "Tải CV",
    chatWithAi: "Chat với AI",
    stats: ["Kỹ năng chính", "Dự án nổi bật", "Sẵn sàng tuyển dụng"],
    scrollAbout: "Cuộn tới phần giới thiệu",
    aboutEyebrow: "Giới thiệu",
    aboutTitle: "Growth marketing với tư duy sản phẩm.",
    competenciesEyebrow: "Năng lực cốt lõi",
    competenciesTitle: "Kỹ năng để recruiter nắm bắt thật nhanh.",
    journeyEyebrow: "Hành trình nghề nghiệp",
    journeyTitle: "Timeline tập trung vào học hỏi và kết quả đo lường được.",
    projectsEyebrow: "Dự án nổi bật",
    projectsTitle: "Các case tăng trưởng được trình bày rõ mục tiêu và kết quả.",
    goal: "Mục tiêu",
    result: "Kết quả",
    kpi: "KPI",
    certificationsEyebrow: "Chứng chỉ",
    certificationsTitle: "Chứng nhận và quá trình học tập có trọng tâm.",
    contactEyebrow: "Liên hệ",
    contactTitle: "Sẵn sàng cho cuộc trò chuyện với recruiter.",
    contactIntro:
      "Với các vai trò Product Marketing, Growth Marketing, Community Growth hoặc marketing ứng dụng AI, anh/chị có thể liên hệ trực tiếp hoặc dùng AI assistant để yêu cầu nhận CV.",
    recruiterFlow: "Luồng recruiter",
    recruiterFlowTitle: "Hỏi AI, để lại thông tin, nhận CV.",
    recruiterFlowBody:
      "Assistant có thể thu thập họ tên recruiter, công ty, email và vị trí tuyển dụng, sau đó gửi lead sang n8n webhook để lưu Google Sheet, thông báo email và tự động gửi CV.",
    contactNow: "Liên hệ ngay",
    footer: "Portfolio Growth Marketing."
  }
};

const navTargets = ["#about", "#competencies", "#journey", "#projects", "#contact"];
const pwaDemoUrl = "https://trans-organization-30.gitbook.io/push-notification/";
const infinaCommunityDemoUrl =
  "https://docs.google.com/spreadsheets/d/1tAmHKdKmn7Lbil8fpxmIv2K0vTxOTd6w/edit?usp=sharing&ouid=106069015846867449298&rtpof=true&sd=true";
const edtronautCommunityDemoUrl = "https://www.facebook.com/groups/3729710727286557?locale=vi_VN";
const edtronautDataWebinarDemoUrl = "https://edtronaut.ai/event/ai-in-data-analytics";
const fidtCommunityDemoUrl = "https://www.facebook.com/groups/411223399427851?locale=vi_VN";
const fidtVideoDemoUrl = "https://www.youtube.com/playlist?list=PLI7q61iAhBb_SRkYjsG_Lx0JOxguF4tSS";
const metricPattern = /(\b\d[\d.,]*(?:%|\+)?\b)/g;

function highlightMetrics(text: string) {
  return text.split(metricPattern).map((part, index) => {
    if (metricPattern.test(part)) {
      metricPattern.lastIndex = 0;
      return (
        <span key={`${part}-${index}`} className="font-semibold text-cyan-200">
          {part}
        </span>
      );
    }

    metricPattern.lastIndex = 0;
    return part;
  });
}

function getHighlightDemoUrl(company: string, highlight: string) {
  const normalizedHighlight = highlight.toLowerCase();

  if (highlight.includes("PWA")) return pwaDemoUrl;
  if (company.includes("Infina") && highlight.includes("Community")) return infinaCommunityDemoUrl;

  if (company.includes("Edtronaut")) {
    if (normalizedHighlight.includes("community") || normalizedHighlight.includes("cộng đồng")) {
      return edtronautCommunityDemoUrl;
    }

    if (normalizedHighlight.includes("webinar") && normalizedHighlight.includes("data")) {
      return edtronautDataWebinarDemoUrl;
    }
  }

  if (company.includes("FIDT")) {
    if (normalizedHighlight.includes("community") || normalizedHighlight.includes("cộng đồng")) {
      return fidtCommunityDemoUrl;
    }

    if (
      normalizedHighlight.includes("video") ||
      normalizedHighlight.includes("canva") ||
      normalizedHighlight.includes("quay dựng")
    ) {
      return fidtVideoDemoUrl;
    }
  }

  return "";
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const portfolio = locale === "vi" ? portfolioVi : portfolioEn;
  const t = copy[locale];

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "vi" || saved === "en") {
      setLocale(saved);
      document.documentElement.lang = saved;
      return;
    }

    document.documentElement.lang = "en";
  }, []);

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    localStorage.setItem("locale", nextLocale);
    document.documentElement.lang = nextLocale;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_20%_8%,rgba(34,146,190,0.36),transparent_28%),linear-gradient(135deg,#07111f_0%,#0b2237_46%,#020713_100%)] text-white transition-colors">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-[#06101d]/78 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between">
          <a
            href="#hero"
            aria-label="AI portfolio home"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-300/12 text-cyan-100 shadow-[0_0_24px_rgba(103,232,249,0.16)] transition hover:border-cyan-200/60 hover:bg-cyan-300/20"
          >
            <Bot size={20} strokeWidth={2.2} />
          </a>
          <nav className="hidden items-center gap-5 text-xs font-medium text-white/68 md:flex">
            {t.nav.map((label, index) => (
              <a key={navTargets[index]} href={navTargets[index]} className="transition hover:text-cyan-300">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={portfolio.person.cvUrl}
              download
              className="hidden h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-slate-950 shadow-[0_10px_30px_rgba(103,232,249,0.18)] transition hover:bg-cyan-300 sm:flex"
            >
              <Download size={14} />
              CV
            </a>
            <LanguageToggle locale={locale} onChange={changeLocale} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section id="hero" className="relative px-5 pb-2 pt-24 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-24rem)] max-w-5xl flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex w-full flex-col items-center"
          >
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.2em] text-white/58">
              Portfolio Product Marketing & Growth Specialist
            </p>

            <div className="relative mb-8">
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-full border border-cyan-300/25"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(165,243,252,0.95)]" />
              </motion.div>
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-7 rounded-full border border-dashed border-cyan-200/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute bottom-[12%] right-[8%] h-1.5 w-1.5 rounded-full bg-sky-400/80 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
              </motion.div>
              <div className="grid h-28 w-28 place-items-center rounded-full border border-cyan-300/25 bg-cyan-300/5 shadow-[0_0_0_10px_rgba(103,232,249,0.05)] backdrop-blur sm:h-32 sm:w-32">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-white shadow-[0_18px_50px_rgba(1,8,18,0.32)] sm:h-28 sm:w-28">
                  <Image
                    src={portfolio.person.avatar}
                    alt={`${portfolio.person.name} avatar`}
                    width={224}
                    height={224}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-ai-assistant"))}
                className="absolute right-0 top-9 grid h-7 w-7 place-items-center rounded-full border border-cyan-200/40 bg-cyan-200 text-slate-950 shadow-[0_10px_30px_rgba(103,232,249,0.3)] transition hover:scale-105 sm:right-1 sm:top-10"
                aria-label={t.chatWithAi}
              >
                <Bot size={15} />
              </button>
            </div>

            <h1 className="max-w-4xl text-[3rem] font-semibold tracking-normal text-[#d7e8ff] sm:text-[3rem] lg:text-[3rem]">
              {portfolio.person.name}
            </h1>
            <p className="mt-5 text-base font-semibold text-white/86 sm:text-xl">
              {portfolio.person.title}
            </p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/58 sm:text-base sm:leading-8">
              {portfolio.person.tagline}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={portfolio.person.cvUrl}
                download
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_42px_rgba(103,232,249,0.2)] transition hover:bg-cyan-300"
              >
                <Download size={16} />
                {t.downloadCv}
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-ai-assistant"))}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-cyan-300/70 hover:text-cyan-200"
              >
                <MessageCircle size={16} />
                {t.chatWithAi}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Section id="about" eyebrow={t.aboutEyebrow} title={t.aboutTitle}>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <p className="text-sm leading-7 text-white/72">{portfolio.about.summary}</p>
            <p className="mt-5 text-sm leading-7 text-white/72">{portfolio.about.direction}</p>
          </div>
          <div className="grid gap-3">
            {portfolio.about.strengths.map((strength) => (
              <div
                key={strength}
                className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                <p className="text-sm leading-6 text-white/72">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="competencies" eyebrow={t.competenciesEyebrow} title={t.competenciesTitle}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {portfolio.competencies.map((item, index) => {
            const Icon = competencyIcons[index] || Sparkles;
            return (
              <div
                key={item}
                className="min-h-28 rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white/[0.1]"
              >
                <Icon size={20} className="mb-4 text-cyan-300" />
                <h3 className="text-sm font-semibold leading-5 text-white">{item}</h3>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="journey" eyebrow={t.journeyEyebrow} title={t.journeyTitle}>
        <div className="relative border-l border-cyan-200/20 pl-6">
          {portfolio.career.map((item) => (
            <div key={`${item.company}-${item.period}`} className="relative mb-8 last:mb-0">
              <span className="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full bg-cyan-300" />
              <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
                      <Building2 size={15} />
                      {item.company}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{item.role}</h3>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-white/55">
                    <CalendarDays size={15} />
                    {item.period}
                  </p>
                </div>
                <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-cyan-300">
                  {item.highlights.map((highlight) => {
                    const demoUrl = getHighlightDemoUrl(item.company, highlight);

                    return (
                      <li key={highlight} className="pl-1 text-sm leading-6 text-white/72">
                        {highlightMetrics(highlight)}
                        {demoUrl ? (
                        <a
                          href={demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 inline-flex items-center gap-1 font-semibold text-cyan-200 underline decoration-cyan-200/35 underline-offset-4 transition hover:text-cyan-100"
                        >
                          {locale === "vi" ? "Xem demo" : "View demo"}
                          <ExternalLink size={13} />
                        </a>
                      ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="projects" eyebrow={t.projectsEyebrow} title={t.projectsTitle}>
        <div className="grid gap-5 lg:grid-cols-3">
          {portfolio.projects.map((project) => (
            <article
              key={project.name}
              className="flex min-h-[360px] flex-col rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/[0.1]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">{project.name}</h3>
              <p className="mt-2 text-xs font-semibold text-cyan-200">{project.role}</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                <p>
                  <span className="font-semibold text-white">{t.goal}: </span>
                  {project.goal}
                </p>
                <p>
                  <span className="font-semibold text-white">{t.result}: </span>
                  {project.result}
                </p>
                <p>
                  <span className="font-semibold text-white">{t.kpi}: </span>
                  {project.kpi}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-cyan-200/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/68"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="certifications" eyebrow={t.certificationsEyebrow} title={t.certificationsTitle}>
        <div className="grid gap-4 md:grid-cols-3">
          {portfolio.certifications.map((certification) => (
            <div
              key={certification.name}
              className="rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur"
            >
              <FileText size={20} className="mb-4 text-cyan-300" />
              <h3 className="text-base font-semibold leading-6 text-white">{certification.name}</h3>
              <p className="mt-3 text-xs text-white/55">
                {certification.issuer} / {certification.year}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" eyebrow={t.contactEyebrow} title={t.contactTitle}>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
            <p className="text-sm leading-7 text-white/72">
              {t.contactIntro}
            </p>
            <div className="mt-6 space-y-3">
              <a href={`mailto:${portfolio.person.email}`} className="flex items-center gap-3 text-sm text-white">
                <Mail size={17} className="text-cyan-300" />
                {portfolio.person.email}
              </a>
              <a
                href={portfolio.person.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-white"
              >
                <Linkedin size={17} className="text-cyan-300" />
                LinkedIn
                <ExternalLink size={14} />
              </a>
              <a
                href={portfolio.person.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-white"
              >
                <Facebook size={17} className="text-cyan-300" />
                Facebook
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-cyan-200/20 bg-white p-5 text-slate-950 shadow-[0_24px_80px_rgba(1,8,18,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">{t.recruiterFlow}</p>
            <h3 className="mt-3 text-2xl font-semibold">{t.recruiterFlowTitle}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {t.recruiterFlowBody}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${portfolio.person.email}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <Mail size={17} />
                {t.contactNow}
              </a>
              <a
                href={portfolio.person.cvUrl}
                download
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-950/15 px-5 text-sm font-semibold transition hover:border-sky-700 hover:text-sky-700"
              >
                <Download size={17} />
                {t.downloadCv}
              </a>
            </div>
          </div>
        </div>
      </Section>

      <footer className="border-t border-white/10 px-5 py-7 text-xs text-white/45 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {new Date().getFullYear()} {portfolio.person.name}. {t.footer}</p>
          <p>{portfolio.person.location}</p>
        </div>
      </footer>

      <AiRecruiterAssistant locale={locale} />
    </main>
  );
}
