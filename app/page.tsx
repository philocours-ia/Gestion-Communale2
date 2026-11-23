import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/workspace");
  }

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(circle at 80% 10%, #243a73 0, transparent 34%), linear-gradient(135deg,#10182e,#121d3b 60%,#101827)", color: "#f8fafc", padding: "32px clamp(20px,5vw,76px)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/omnia-logo.svg" width="46" height="46" alt="" />
            <div><div style={{ fontSize: 11, letterSpacing: ".2em", color: "#9eb8ff", fontWeight: 800 }}>SYGEC-IA</div><strong style={{ fontSize: 22, letterSpacing: ".08em" }}>OMNIA</strong></div>
          </div>
          <Link href="/login" style={{ color: "#fff", textDecoration: "none", background: "#4770d9", borderRadius: 12, padding: "12px 18px", fontWeight: 750 }}>Se connecter →</Link>
        </header>

        <section style={{ padding: "clamp(54px,9vw,112px) 0 42px", maxWidth: 900 }}>
          <p style={{ color: "#8edbde", fontSize: 12, fontWeight: 800, letterSpacing: ".18em" }}>UN ÉCOSYSTÈME D'INTELLIGENCES SPÉCIALISÉES</p>
          <h1 style={{ fontSize: "clamp(38px,6.3vw,72px)", lineHeight: 1.05, letterSpacing: "-.055em", margin: "18px 0" }}>Une intelligence plurielle pour <span style={{ color: "#93b7ff" }}>gérer, enseigner et rédiger.</span></h1>
          <p style={{ maxWidth: 750, color: "#c4cee0", fontSize: 17, lineHeight: 1.8 }}>OMNIA coordonne des expertises distinctes : gestion et comptabilité des collectivités territoriales, enseignement et formation, recherche documentaire, rédaction administrative et préparation des actes d'état civil.</p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16, marginBottom: 34 }}>
          <article style={{ border: "1px solid #536db0", background: "#172748", borderRadius: 20, padding: 22 }}>
            <div style={{ color: "#84c9ff", fontSize: 12, fontWeight: 800, letterSpacing: ".12em" }}>MIORA · CTD</div>
            <h2 style={{ fontSize: 23, margin: "12px 0 8px" }}>Gestion communale</h2>
            <p style={{ color: "#c4cee0", lineHeight: 1.7, fontSize: 14 }}>Budgets BP, BA, BR, CA, procédures, PCOP CTD, gouvernance, personnel, patrimoine et performance.</p>
          </article>
          <article style={{ border: "1px solid #665caa", background: "#211e42", borderRadius: 20, padding: 22 }}>
            <div style={{ color: "#c0acff", fontSize: 12, fontWeight: 800, letterSpacing: ".12em" }}>MIA · PHILOSOPHIE & RÉDACTION</div>
            <h2 style={{ fontSize: 23, margin: "12px 0 8px" }}>Penser et écrire</h2>
            <p style={{ color: "#d1cde4", lineHeight: 1.7, fontSize: 14 }}>Problématisation, concepts, argumentation, explication de textes, dissertation et rédaction administrative.</p>
          </article>
          <article style={{ border: "1px solid #3d8b91", background: "#14353c", borderRadius: 20, padding: 22 }}>
            <div style={{ color: "#8de8da", fontSize: 12, fontWeight: 800, letterSpacing: ".12em" }}>MIORA MATHS · ENSEIGNEMENT</div>
            <h2 style={{ fontSize: 23, margin: "12px 0 8px" }}>Apprendre pas à pas</h2>
            <p style={{ color: "#c5e0df", lineHeight: 1.7, fontSize: 14 }}>Raisonnement, calculs, démonstrations et exercices guidés, dans le périmètre pédagogique déclaré.</p>
          </article>
        </section>

        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18, borderTop: "1px solid #344365", paddingTop: 25 }}>
          <div><h2 style={{ fontSize: 20, margin: "0 0 7px" }}>La gestion communale historique reste accessible.</h2><p style={{ color: "#aebbd2", margin: 0, fontSize: 13 }}>Ouvrir l'interface CTD conservée pendant la migration.</p></div>
          <Link href="/gestion-communale.html" style={{ color: "#dce8ff", textDecoration: "none", border: "1px solid #6e8ac1", borderRadius: 12, padding: "12px 16px", fontWeight: 750 }}>Ouvrir l'interface CTD ↗</Link>
        </section>
        <footer style={{ color: "#8696b4", fontSize: 12, marginTop: 44 }}>Les documents administratifs et d'état civil produits par l'IA restent des projets. Les contrôles, visas et validations officielles relèvent des agents et autorités habilités.</footer>
      </div>
    </main>
  );
}
