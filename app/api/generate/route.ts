import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import type { GeneratePlanRequest } from "@/lib/types";

function buildPrompt(subject: string, topics: string, examDate: string) {
  const today = new Date().toISOString().split("T")[0];
  const daysUntilExam = Math.max(
    1,
    Math.ceil(
      (new Date(examDate).getTime() - new Date(today).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return `You are an expert study planner. Create a personalized day-by-day study schedule for a student.

Subject: ${subject}
Topics: ${topics}
Exam Date: ${examDate}
Days available: ${daysUntilExam}

Requirements:
- Break the schedule into daily tasks covering all topics
- Include revision days before the exam
- Add short breaks and realistic study hours (2-4 hours per day)
- Prioritize harder topics earlier
- Use clear headings like "Day 1", "Day 2", etc.
- Keep the plan practical and motivating

Return only the study schedule, no extra introduction.`;
}

async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful academic study planner. Create clear, structured study schedules.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content received from Groq API");
  }

  return content.trim();
}

function generateFallbackPlan(
  subject: string,
  topics: string,
  examDate: string
): string {
  const topicList = topics
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const today = new Date();
  const exam = new Date(examDate);
  const days = Math.max(
    1,
    Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  let plan = `Study Plan for ${subject}\nExam Date: ${examDate}\n\n`;

  for (let i = 1; i <= days; i++) {
    const topicIndex = (i - 1) % Math.max(topicList.length, 1);
    const topic = topicList[topicIndex] || "General revision";
    const isRevision = i > days - 2;

    plan += `Day ${i}:\n`;
    if (isRevision) {
      plan += `- Full revision of all topics\n- Practice past papers (2 hours)\n- Review weak areas (1 hour)\n\n`;
    } else {
      plan += `- Study: ${topic} (2 hours)\n- Practice exercises (1 hour)\n- Quick recap of previous topics (30 min)\n\n`;
    }
  }

  return plan.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePlanRequest = await request.json();
    const { subject, topics, examDate } = body;

    if (!subject?.trim() || !topics?.trim() || !examDate) {
      return NextResponse.json(
        { error: "Subject, topics, and exam date are required" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(subject.trim(), topics.trim(), examDate);

    let planContent: string;
    try {
      planContent = await generateWithGroq(prompt);
    } catch {
      planContent = generateFallbackPlan(subject.trim(), topics.trim(), examDate);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("study_plans")
      .insert({
        subject: subject.trim(),
        topics: topics.trim(),
        exam_date: examDate,
        plan: planContent,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to save plan: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
