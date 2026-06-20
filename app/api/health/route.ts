import { NextResponse } from "next/server";
import { checkSupabaseConnection } from "@/lib/supabase";

export async function GET() {
  const supabase = await checkSupabaseConnection();
  const groqConfigured = Boolean(process.env.GROQ_API_KEY?.trim());

  return NextResponse.json({
    supabase,
    groqConfigured,
    ready: supabase.ok,
  });
}
