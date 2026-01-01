# Pathr

> *Your career, mapped.*

**Pathr** is an AI-powered career guidance application that analyzes your resume and generates personalized career roadmaps.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- **🎯 Personalized Career Paths** - AI analyzes your resume to suggest tailored career directions
- **📊 Detailed Roadmaps** - Each path includes timeline, salary expectations, and step-by-step milestones
- **🛠️ Skill Gap Analysis** - Identifies skills you need to develop for each career path
- **📄 PDF Export** - Download beautifully styled career blueprints
- **🔒 Secure Processing** - Your resume data is processed securely
- **✨ Modern UI** - Soft dark theme with interactive animated background

## 🚀 How It Works

1. **Upload Resume** - Drop your PDF resume into the app
2. **AI Analysis** - LangChain processes and extracts your skills & experience
3. **Get Paths** - Receive multiple personalized career recommendations
4. **Explore & Export** - Browse detailed roadmaps and download as PDF

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | LangChain |
| PDF Generation | jsPDF |
| UI Components | shadcn/ui |

## 📦 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📁 Project Structure

```
├── app/
│   ├── (root)/          # Main landing page
│   ├── api/parse-pdf/   # PDF parsing API endpoint
│   └── globals.css      # Global styles & theme
├── components/
│   ├── AnalysisResults  # Career paths display & PDF export
│   ├── ResumeUpload     # File upload interface
│   └── ui/              # shadcn/ui components
├── lib/
│   └── langchain.service.ts  # AI analysis service
└── public/
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <strong>Pathr</strong>
</p>
