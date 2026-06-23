# Growth Marketing Portfolio

Modern personal portfolio for a Product & Growth Marketing Specialist.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Update portfolio data

Edit `data/portfolio.json` to update profile, projects, career journey, certifications, FAQ, contact links, and CV URL.

## CV file

The download button points to:

```txt
public/cv/Tran-Minh-Thuan-CV.pdf
```

Replace that file when the CV changes.

## AI and n8n

Create `.env.local` from `.env.example`.

```txt
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
N8N_WEBHOOK_URL=https://your-n8n-webhook-url
```

Without `OPENAI_API_KEY`, the chatbot uses local FAQ fallback answers from `data/portfolio.json`.

Expected n8n payload:

```json
{
  "name": "Recruiter name",
  "company": "Company",
  "email": "recruiter@example.com",
  "position": "Growth Marketing Specialist",
  "candidate": "Tran Minh Thuan",
  "cvUrl": "/cv/Tran-Minh-Thuan-CV.pdf",
  "requestedAt": "ISO timestamp"
}
```
