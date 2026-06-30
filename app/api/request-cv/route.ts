import { NextResponse } from "next/server";
import { getPortfolio, type Locale } from "@/lib/portfolio";

type CvRequest = {
  name?: string;
  company?: string;
  email?: string;
  position?: string;
  locale?: Locale;
};

function buildEmailSubject(locale: Locale, position: string) {
  return locale === "vi"
    ? `CV Trần Minh Thuận - ${position}`
    : `Tran Minh Thuan CV - ${position}`;
}

function buildEmailBody({
  locale,
  company,
  position,
  portfolioUrl,
  cvPublicUrl
}: {
  locale: Locale;
  company: string;
  position: string;
  portfolioUrl: string;
  cvPublicUrl: string;
}) {
  if (locale === "vi") {
    return `Kính gửi Anh/Chị Đại diện Tuyển dụng,

Em là Trần Minh Thuận, Product Marketing & Growth Marketing. Em xin gửi đến Anh/Chị hồ sơ ứng tuyển cho vị trí ${position} tại ${company}.

Sau khi tìm hiểu về công việc và định hướng phát triển của doanh nghiệp, em nhận thấy kinh nghiệm và thế mạnh của mình có nhiều điểm phù hợp với vị trí này. Trong quá trình làm việc, em đã có cơ hội tham gia các dự án trong lĩnh vực Fintech, Edtech và ERP, tập trung vào các hoạt động tăng trưởng người dùng, phát triển cộng đồng, tối ưu kênh nội dung và hỗ trợ phát triển sản phẩm.

Một số kinh nghiệm nổi bật của em gồm:

- Phát triển cộng đồng người dùng từ 36.000 lên 80.000 thành viên tại Infina và từ 7.000 lên 15.000 thành viên tại Vietnam Personal Finance.
- Xây dựng và triển khai các hoạt động SEO, Content Marketing và Community Marketing, góp phần tăng 20% lượng truy cập website trong vòng 3 tháng.
- Tổ chức các webinar, diễn đàn chuyên ngành và các chương trình livestream với hàng trăm người tham gia, giúp gia tăng nhận diện thương hiệu và mức độ tương tác của khách hàng.
- Quản lý dữ liệu khách hàng, phân nhóm người dùng và hỗ trợ triển khai các chiến dịch Email Marketing, CRM và Customer Retention.
- Nghiên cứu thị trường, phân tích đối thủ cạnh tranh và hành vi người dùng nhằm đề xuất các sáng kiến tăng trưởng và cải thiện trải nghiệm khách hàng.

Bên cạnh kinh nghiệm Marketing, em cũng có nền tảng về công nghệ và phân tích dữ liệu, giúp em dễ dàng làm việc với các sản phẩm số, theo dõi hiệu quả chiến dịch dựa trên dữ liệu và phối hợp hiệu quả với các đội ngũ Product, Business và Development.

Em có đính kèm CV và Portfolio để Anh/Chị tham khảo thêm về các dự án đã thực hiện. Em rất mong có cơ hội tham gia phỏng vấn để trao đổi chi tiết hơn về cách em có thể đóng góp vào mục tiêu tăng trưởng và phát triển sản phẩm của Quý Công ty.

Portfolio: ${portfolioUrl}
CV: ${cvPublicUrl}

Em xin chân thành cảm ơn Anh/Chị đã dành thời gian xem xét hồ sơ.

Trân trọng,

Trần Minh Thuận

Product & Growth Marketing Specialist`;
  }

  return `Dear Hiring Representative,

My name is Tran Minh Thuan, a Product Marketing & Growth Marketing specialist. I would like to share my application profile for the ${position} position at ${company}.

After learning about the role and the company's growth direction, I believe my experience and strengths align well with this opportunity. I have worked across Fintech, EdTech, and ERP projects, focusing on user growth, community development, content channel optimization, and product support.

Some highlights of my experience include:

- Growing user communities from 36,000 to 80,000 members at Infina and from 7,000 to 15,000 members at Vietnam Personal Finance.
- Building SEO, Content Marketing, and Community Marketing activities that contributed to a 20% increase in website traffic within 3 months.
- Organizing webinars, industry forums, and livestream programs with hundreds of participants to improve brand awareness and customer engagement.
- Managing customer data, segmenting users, and supporting Email Marketing, CRM, and Customer Retention campaigns.
- Conducting market research, competitor analysis, and user behavior analysis to propose growth initiatives and improve customer experience.

Alongside my marketing experience, I also have a background in technology and data analysis, which helps me work effectively with digital products, track campaign performance, and collaborate with Product, Business, and Development teams.

I have attached my CV and portfolio for your reference. I would be grateful for the opportunity to interview and discuss how I can contribute to your company's growth and product development goals.

Portfolio: ${portfolioUrl}
CV: ${cvPublicUrl}

Thank you for your time and consideration.

Best regards,

Tran Minh Thuan

Product & Growth Marketing Specialist`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[character] || character
  );
}

function buildEmailHtml({
  locale,
  company,
  position,
  portfolioUrl
}: {
  locale: Locale;
  company: string;
  position: string;
  portfolioUrl: string;
}) {
  const safeCompany = escapeHtml(company);
  const safePosition = escapeHtml(position);
  const safePortfolioUrl = escapeHtml(portfolioUrl);
  const shell = (content: string) => `
    <div style="margin:0;padding:0;background:#ffffff;color:#202124;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65">
      <div style="max-width:720px;margin:0;padding:8px 4px">
        ${content}
      </div>
    </div>`;

  if (locale === "vi") {
    return shell(`
      <p style="margin:0 0 18px">Kính gửi Anh/Chị Đại diện Tuyển dụng,</p>
      <p style="margin:0 0 18px">Em là <strong>Trần Minh Thuận</strong>, chuyên môn <strong>Product Marketing &amp; Growth Marketing</strong>. Em xin gửi đến Anh/Chị hồ sơ ứng tuyển cho vị trí <strong>${safePosition}</strong> tại <strong>${safeCompany}</strong>.</p>
      <p style="margin:0 0 18px">Sau khi tìm hiểu về công việc và định hướng phát triển của doanh nghiệp, em nhận thấy kinh nghiệm và thế mạnh của mình có nhiều điểm phù hợp với vị trí này. Em đã tham gia các dự án trong lĩnh vực <strong>Fintech, EdTech và ERP</strong>, tập trung vào tăng trưởng người dùng, phát triển cộng đồng, tối ưu kênh nội dung và hỗ trợ phát triển sản phẩm.</p>
      <p style="margin:0 0 8px"><strong>Một số kinh nghiệm nổi bật của em gồm:</strong></p>
      <ul style="margin:0 0 18px;padding-left:24px">
        <li style="margin:0 0 8px">Phát triển cộng đồng người dùng từ <strong>36.000 lên 80.000 thành viên</strong> tại Infina và từ <strong>7.000 lên 15.000 thành viên</strong> tại Vietnam Personal Finance.</li>
        <li style="margin:0 0 8px">Triển khai <strong>SEO, Content Marketing và Community Marketing</strong>, góp phần tăng <strong>20% lượng truy cập website trong 3 tháng</strong>.</li>
        <li style="margin:0 0 8px">Tổ chức webinar, diễn đàn chuyên ngành và livestream với <strong>hàng trăm người tham gia</strong>, gia tăng nhận diện thương hiệu và tương tác khách hàng.</li>
        <li style="margin:0 0 8px">Quản lý dữ liệu, phân nhóm người dùng và hỗ trợ các chiến dịch <strong>Email Marketing, CRM và Customer Retention</strong>.</li>
        <li style="margin:0">Nghiên cứu thị trường, đối thủ và hành vi người dùng để đề xuất sáng kiến tăng trưởng và cải thiện trải nghiệm khách hàng.</li>
      </ul>
      <p style="margin:0 0 18px">Bên cạnh Marketing, em có nền tảng về <strong>công nghệ và phân tích dữ liệu</strong>, giúp em làm việc hiệu quả với sản phẩm số, theo dõi hiệu quả chiến dịch và phối hợp cùng các đội ngũ Product, Business và Development.</p>
      <p style="margin:0 0 18px">CV được đính kèm trong email. Anh/Chị có thể xem thêm các dự án em đã thực hiện tại:<br><strong>Portfolio:</strong> <a href="${safePortfolioUrl}" style="color:#1155cc">${safePortfolioUrl}</a></p>
      <p style="margin:0 0 18px">Em rất mong có cơ hội tham gia phỏng vấn để trao đổi chi tiết hơn về cách em có thể đóng góp vào mục tiêu tăng trưởng và phát triển sản phẩm của Quý Công ty.</p>
      <p style="margin:0 0 18px">Em xin chân thành cảm ơn Anh/Chị đã dành thời gian xem xét hồ sơ.</p>
      <p style="margin:0">Trân trọng,<br><strong>Trần Minh Thuận</strong><br>Product &amp; Growth Marketing Specialist</p>`);
  }

  return shell(`
    <p style="margin:0 0 18px">Dear Hiring Representative,</p>
    <p style="margin:0 0 18px">My name is <strong>Tran Minh Thuan</strong>, specializing in <strong>Product Marketing &amp; Growth Marketing</strong>. I am pleased to submit my application for the <strong>${safePosition}</strong> position at <strong>${safeCompany}</strong>.</p>
    <p style="margin:0 0 18px">After learning about the role and your company's direction, I believe my experience aligns well with this opportunity. I have contributed to <strong>Fintech, EdTech, and ERP</strong> projects focused on user growth, community development, content optimization, and product support.</p>
    <p style="margin:0 0 8px"><strong>Highlights of my experience include:</strong></p>
    <ul style="margin:0 0 18px;padding-left:24px">
      <li style="margin:0 0 8px">Growing communities from <strong>36,000 to 80,000 members</strong> at Infina and from <strong>7,000 to 15,000 members</strong> at Vietnam Personal Finance.</li>
      <li style="margin:0 0 8px">Delivering <strong>SEO, Content Marketing, and Community Marketing</strong> initiatives that increased website traffic by <strong>20% within 3 months</strong>.</li>
      <li style="margin:0 0 8px">Organizing webinars, industry forums, and livestreams with <strong>hundreds of participants</strong> to strengthen brand awareness and customer engagement.</li>
      <li style="margin:0 0 8px">Managing customer data, user segmentation, and <strong>Email Marketing, CRM, and Customer Retention</strong> campaigns.</li>
      <li style="margin:0">Conducting market, competitor, and user behavior research to propose growth initiatives and improve customer experience.</li>
    </ul>
    <p style="margin:0 0 18px">Alongside Marketing, my background in <strong>technology and data analysis</strong> helps me work effectively with digital products, measure campaign performance, and collaborate across Product, Business, and Development teams.</p>
    <p style="margin:0 0 18px">My CV is attached to this email. You can also view selected projects at:<br><strong>Portfolio:</strong> <a href="${safePortfolioUrl}" style="color:#1155cc">${safePortfolioUrl}</a></p>
    <p style="margin:0 0 18px">I would welcome an opportunity to discuss how I can contribute to your company's product and growth goals.</p>
    <p style="margin:0 0 18px">Thank you for your time and consideration.</p>
    <p style="margin:0">Best regards,<br><strong>Tran Minh Thuan</strong><br>Product &amp; Growth Marketing Specialist</p>`);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CvRequest;
  const locale: Locale = body.locale === "vi" ? "vi" : "en";
  const portfolio = getPortfolio(locale);
  const required = ["name", "company", "email", "position"] as const;
  const missing = required.filter((key) => !body[key]?.trim());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const webhookUrl = process.env.CV_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
  const company = body.company?.trim() || (locale === "vi" ? "Quý Công ty" : "your company");
  const position = body.position?.trim() || "Product & Growth Marketing";
  const recruiterEmail = body.email?.trim() || "";
  const cvFileName = portfolio.person.cvUrl.split("/").pop() || "Tran-Minh-Thuan-CV.pdf";
  const cvPublicUrl = siteUrl + portfolio.person.cvUrl;
  const emailSubject = buildEmailSubject(locale, position);
  const emailTextBody = buildEmailBody({
    locale,
    company,
    position,
    portfolioUrl: siteUrl,
    cvPublicUrl
  });
  const emailHtmlBody = buildEmailHtml({
    locale,
    company,
    position,
    portfolioUrl: siteUrl
  });

  if (missing.length) {
    return NextResponse.json(
      {
        ok: false,
        message:
          locale === "vi"
            ? `Thiếu thông tin bắt buộc: ${missing.join(", ")}`
            : `Missing required fields: ${missing.join(", ")}`
      },
      { status: 400 }
    );
  }

  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        message:
          locale === "vi"
            ? "Chức năng gửi CV qua email chưa được cấu hình. Vui lòng thêm CV_WEBHOOK_URL."
            : "CV email delivery is not configured yet. Please add CV_WEBHOOK_URL."
      },
      { status: 503 }
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recruiter: {
        name: body.name?.trim(),
        company,
        email: recruiterEmail,
        position
      },
      email: {
        from: portfolio.person.email,
        to: recruiterEmail,
        subject: emailSubject,
        textBody: emailTextBody,
        htmlBody: emailHtmlBody,
        cvFileName,
        cvPublicUrl,
        portfolioUrl: siteUrl
      },
      locale,
      language: locale === "vi" ? "Vietnamese" : "English",
      requestedAt: new Date().toISOString(),
      candidate: portfolio.person.name,
      candidateTitle: portfolio.person.title,
      cvLanguage: locale === "vi" ? "Vietnamese" : "English",
      cvFileName,
      cvPublicUrl,
      source: "portfolio-ai-assistant"
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        message:
          locale === "vi"
            ? "Webhook gửi CV chưa phản hồi thành công."
            : "The CV delivery webhook did not respond successfully."
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      locale === "vi"
        ? "Cảm ơn anh/chị. CV đã được gửi tới email của anh/chị."
        : "Thank you. The CV has been sent to your email."
  });
}
