import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getEnv(name: string): string {
  return (process.env[name] ?? "").trim();
}

function validateSupabaseConfig(): { url: string; key: string } {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the dev server."
    );
  }

  if (url.includes("your-project") || key.includes("your_supabase")) {
    throw new Error(
      "Supabase still has placeholder values in .env.local. Replace them with your real project URL and anon key from supabase.com/dashboard."
    );
  }

  if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
    throw new Error(
      `Invalid Supabase URL: "${url}". It should look like https://abcdefgh.supabase.co (from Project Settings → API).`
    );
  }

  if (!key.startsWith("eyJ")) {
    throw new Error(
      "Invalid Supabase anon key. Use the 'anon public' key from Project Settings → API, not the database password."
    );
  }

  return { url, key };
}

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const { url, key } = validateSupabaseConfig();
  client = createClient(url, key);
  return client;
}

export async function getFetchDiagnostics(): Promise<string> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  if (!url) {
    return "NEXT_PUBLIC_SUPABASE_URL is not set.";
  }
  try {
    const res = await fetch(url, { method: "GET" });
    return `Successfully connected to ${url} (status: ${res.status}).`;
  } catch (err: any) {
    const parts: string[] = [];
    if (err instanceof Error) {
      parts.push(`Error name: ${err.name}`);
      parts.push(`Error message: ${err.message}`);
      if (err.cause) {
        if (err.cause instanceof Error) {
          parts.push(`Cause message: ${err.cause.message}`);
          if ("code" in err.cause) {
            parts.push(`Cause code: ${(err.cause as any).code}`);
          }
        } else if (typeof err.cause === "object") {
          parts.push(`Cause: ${JSON.stringify(err.cause)}`);
        } else {
          parts.push(`Cause: ${String(err.cause)}`);
        }
      }
    } else {
      parts.push(`Unknown error: ${String(err)}`);
    }
    return `Fetch failed. Details:\n- ${parts.join("\n- ")}`;
  }
}

export async function checkSupabaseConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("study_plans").select("id").limit(1);

    if (error) {
      if (error.message.includes("does not exist")) {
        return {
          ok: false,
          error:
            'Table "study_plans" not found. Run supabase/schema.sql in your Supabase SQL Editor.',
        };
      }
      if (error.message.includes("fetch failed")) {
        const diagnostics = await getFetchDiagnostics();
        return {
          ok: false,
          error: `Cannot reach Supabase. Diagnostics: ${diagnostics}`,
        };
      }
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const cause =
      err instanceof Error && err.cause instanceof Error
        ? err.cause.message
        : "";

    if (message.includes("fetch failed") || cause.includes("fetch failed")) {
      const diagnostics = await getFetchDiagnostics();
      return {
        ok: false,
        error: `Cannot reach Supabase. Diagnostics: ${diagnostics}`,
      };
    }

    return { ok: false, error: message };
  }
}
