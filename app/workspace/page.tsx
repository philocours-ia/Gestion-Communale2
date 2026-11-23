import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WorkspaceClient from "./workspace-client";

export const dynamic = "force-dynamic";

type WorkspacePageProps = {
  searchParams: Promise<{ agent?: string | string[]; intent?: string | string[] }>;
};

const allowedAgents = ["workspace", "miora", "maths", "felix", "mia", "research", "education"] as const;

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const supabase = await createClient();
  if (!supabase) redirect("/setup");

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : null,
    preferred_language: "fr"
  });

  if (profileError) {
    console.error("Profile initialization failed:", profileError.message);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const params = await searchParams;
  const agentValue = Array.isArray(params.agent) ? params.agent[0] : params.agent;
  const intentValue = Array.isArray(params.intent) ? params.intent[0] : params.intent;
  const initialIntent = intentValue === "civil" ? "civil" : undefined;
  const requestedAgent = agentValue === "maths" || agentValue === "education" ? "felix" : agentValue;
  const initialAgent = initialIntent === "civil"
    ? "mia"
    : allowedAgents.includes(requestedAgent as typeof allowedAgents[number])
      ? requestedAgent as typeof allowedAgents[number]
      : "workspace";

  return (
    <WorkspaceClient
      userEmail={user.email ?? ""}
      userRole={profile?.role ?? "user"}
      initialAgent={initialAgent}
      initialIntent={initialIntent}
    />
  );
}
