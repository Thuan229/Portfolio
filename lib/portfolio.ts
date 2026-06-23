import portfolioEn from "@/data/portfolio.json";
import portfolioVi from "@/data/portfolio.vi.json";

export type Locale = "en" | "vi";
export type Portfolio = typeof portfolioEn;

export function getPortfolio(locale: Locale = "en") {
  return locale === "vi" ? portfolioVi : portfolioEn;
}

export function getPortfolioKnowledge(locale: Locale = "en") {
  return JSON.stringify(
    {
      currentLanguage: locale,
      english: portfolioEn,
      vietnamese: portfolioVi
    },
    null,
    2
  );
}

export function localAnswer(message: string, locale: Locale = "en") {
  const portfolio = getPortfolio(locale);
  const text = message.toLowerCase();
  const match = portfolio.faq.find((item) =>
    text.includes(item.question.toLowerCase().slice(0, 14))
  );

  if (match) return match.answer;

  const careerSummary = portfolio.career
    .slice(0, 3)
    .map((item) => `${item.company}: ${item.role}`)
    .join("; ");

  if (text.includes("growth")) {
    return locale === "vi"
      ? `${portfolio.person.name} có nền tảng Growth Marketing khá thực chiến: xây cộng đồng, nghiên cứu thị trường, phân tích chiến dịch và phối hợp product để tạo tăng trưởng có thể đo lường. Một vài điểm nổi bật là tăng Zalo OA từ 0 lên 4.500 follower, xây cộng đồng AI 650 thành viên trong 3 tuần và mở rộng cộng đồng tài chính từ 7.000 lên 15.000 thành viên.`
      : `${portfolio.person.name} has hands-on Growth Marketing experience across community building, market research, campaign analytics, and product collaboration. Highlights include growing a Zalo OA from 0 to 4,500 followers, building a 650-member AI community in 3 weeks, and scaling a finance community from 7,000 to 15,000 members.`;
  }

  if (text.includes("dự án") || text.includes("du an") || text.includes("project")) {
    return locale === "vi"
      ? "Các dự án nổi bật gồm Finance Community Growth Program, Product Marketing Research Sprint và AI-assisted Content and Reporting Workflow. Các phần này thể hiện cách Thuan đi từ insight, nội dung, cộng đồng đến đo lường hiệu quả."
      : "Featured projects include Finance Community Growth Program, Product Marketing Research Sprint, and AI-assisted Content and Reporting Workflow. They show how Thuan connects insight, content, community, and performance measurement.";
  }

  if (text.includes("analytics") || text.includes("data")) {
    return locale === "vi"
      ? `${portfolio.person.name} có kinh nghiệm theo dõi hiệu quả chiến dịch, phân tích hành vi người dùng và chuyển dữ liệu thành đề xuất tối ưu KPI. Phần data nổi bật nhất nằm ở các chiến dịch growth, email marketing, SEO/content và phân tích workflow sản phẩm.`
      : `${portfolio.person.name} can track campaign performance, analyze user behavior, and turn data into KPI optimization recommendations. The strongest data examples appear in growth campaigns, email marketing, SEO/content, and product workflow analysis.`;
  }

  if (text.includes("community") || text.includes("cộng đồng") || text.includes("cong dong")) {
    return locale === "vi"
      ? `${portfolio.person.name} có kinh nghiệm xây và nuôi cộng đồng trong EdTech và FinTech, gồm cộng đồng AI 650 thành viên trong 3 tuần và cộng đồng Vietnam Personal Finance tăng từ 7.000 lên 15.000 thành viên trong 6 tháng.`
      : `${portfolio.person.name} has community-building experience in EdTech and FinTech, including a 650-member AI community built in 3 weeks and a Vietnam Personal Finance community grown from 7,000 to 15,000 members in 6 months.`;
  }

  if (locale === "vi") {
    return `${portfolio.person.name} là ${portfolio.person.title}, có kinh nghiệm ở các mảng Growth Marketing, Product Marketing, Community Growth và phân tích dữ liệu chiến dịch. Một số mốc gần đây: ${careerSummary}. Anh/chị muốn xem sâu hơn về kinh nghiệm, dự án hay kỹ năng nào?`;
  }

  return `${portfolio.person.name} is a ${portfolio.person.title} with experience across Growth Marketing, Product Marketing, Community Growth, and campaign analytics. Recent roles include ${careerSummary}. Which angle would you like to explore: experience, projects, or skills?`;
}
