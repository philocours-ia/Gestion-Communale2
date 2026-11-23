import { NextResponse } from "next/server";

const SUPPORTED_PROVIDERS = ["deepseek", "openai", "anthropic"] as const;

export function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  const provider = (process.env.MIA_PROVIDER || "deepseek").toLowerCase();
  const providerConfigured =
    provider === "deepseek" ? Boolean(process.env.DEEPSEEK_API_KEY) :
    provider === "openai" ? Boolean(process.env.OPENAI_API_KEY) :
    provider === "anthropic" ? Boolean(process.env.ANTHROPIC_API_KEY) :
    false;
  const validProvider = SUPPORTED_PROVIDERS.includes(provider as typeof SUPPORTED_PROVIDERS[number]);

  return NextResponse.json({
    app: "SYGEC-IA • OMNIA",
    status: "ok",
    integrations: {
      supabase: supabaseConfigured ? "configured" : "pending",
      ai: providerConfigured ? "configured" : "pending"
    },
    provider: validProvider ? provider : "invalid",
    model: process.env.MIA_MODEL || (provider === "deepseek" ? "deepseek-flash" : "provider-default")
  });
}
