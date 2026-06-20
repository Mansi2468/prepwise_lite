# PrepWise AI – Smart Study Planner

A simple AI-powered study planner built with Next.js, Tailwind CSS, Supabase, and Groq API. Students enter a subject, topics, and exam date to receive a personalized day-by-day study schedule.

## Features

- **Study form** – Subject, topics, and exam date input
- **AI generation** – Groq LLM creates a personalized schedule
- **Database storage** – Plans saved in Supabase
- **Saved plans page** – View all generated study plans
- **Fallback mode** – Works without Groq API using a basic template

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Groq API](https://groq.com/)
- [Vercel](https://vercel.com/) (deployment)

## Project Structure

```
prepwise-lite/
├── app/
│   ├── page.tsx              # Home – study form
│   ├── layout.tsx            # Root layout with navbar
│   ├── plans/page.tsx        # Saved plans list
│   └── api/
│       ├── generate/route.ts # AI plan generation + save
│       └── plans/route.ts    # Fetch all plans
├── components/
│   ├── StudyForm.tsx
│   ├── PlanCard.tsx
│   └── Navbar.tsx
├── lib/
│   ├── supabase.ts
│   └── types.ts
└── supabase/schema.sql
```

## Setup

### 1. Install dependencies

```bash
cd prepwise-lite
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | API key from [Groq Console](https://console.groq.com/keys) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com/)
2. Open **SQL Editor** and run the script in `supabase/schema.sql`
3. Copy your project URL and anon key into `.env.local`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push the project to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the same environment variables in **Project Settings → Environment Variables**
4. Deploy

## Usage

1. Go to the home page and fill in **Subject**, **Topics** (comma-separated), and **Exam Date**
2. Click **Generate Study Plan**
3. The AI creates a schedule and saves it to Supabase
4. View all plans on the **My Plans** page

## Learning Outcomes

- Next.js routing, components, and API routes
- Supabase database operations (insert & select)
- LLM integration via Groq API
- Full-stack deployment on Vercel
