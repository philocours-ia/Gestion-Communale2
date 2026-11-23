import LoginForm, { type AuthContext } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function contextFromNext(nextValue: string | string[] | undefined): AuthContext {
  const next = Array.isArray(nextValue) ? nextValue[0] ?? "" : nextValue ?? "";
  if (next.includes("agent=miora") || next.includes("gestion-communale")) return "miora";
  if (next.includes("agent=felix") || next.includes("agent=education")) return "felix";
  if (next.includes("agent=mia") || next.includes("intent=civil")) return "mia";
  return "omnia";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return <LoginForm initialAuthContext={contextFromNext(params.next)} />;
}
