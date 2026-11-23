"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PageNavigation from "@/components/navigation/page-navigation";

type Mode = "signin" | "signup";
export type AuthContext = "omnia" | "miora" | "felix" | "mia";

const AUTH_CONTEXTS: Record<AuthContext, {
  eyebrow:string; signInTitle:string; signUpTitle:string; description:string;
  submitText:string; sideEyebrow:string; sideTitle:string; sideTag:string;
}> = {
  omnia:{eyebrow:"OMNIA · ACCÈS CENTRAL",signInTitle:"Bienvenue dans votre univers.",signUpTitle:"Ouvrez votre espace OMNIA.",description:"Connectez-vous pour retrouver vos assistants, vos conversations et vos espaces de travail.",submitText:"Entrer dans OMNIA",sideEyebrow:"UNE INTELLIGENCE PLURIELLE",sideTitle:"Une seule porte.\nMille possibilités.",sideTag:"OMNIA · SYGEC-IA"},
  miora:{eyebrow:"MIORA · GESTION CTD",signInTitle:"Retrouvez votre espace communal.",signUpTitle:"Créez votre accès MIORA.",description:"Accédez à vos dossiers de gestion communale, budgets, tableaux et travaux administratifs.",submitText:"Accéder à MIORA",sideEyebrow:"GESTION DES COLLECTIVITÉS",sideTitle:"Structurer.\nPiloter. Agir.",sideTag:"MIORA · GESTION CTD"},
  felix:{eyebrow:"FELIX · TERMINALE T12",signInTitle:"Retrouvez votre espace pédagogique.",signUpTitle:"Créez votre accès FELIX.",description:"Accédez exclusivement à Terminale T12 : parcours L, S et OSE, cours et suivi pédagogique.",submitText:"Accéder à FELIX",sideEyebrow:"ESPACE PÉDAGOGIQUE",sideTitle:"Comprendre.\nApprendre. Progresser.",sideTag:"FELIX · TERMINALE T12"},
  mia:{eyebrow:"MIA · PHILOSOPHIE & ACCOMPAGNEMENT",signInTitle:"Retrouvez votre espace MIA.",signUpTitle:"Créez votre accès MIA.",description:"Accédez à votre espace de réflexion, de rédaction et d’accompagnement des démarches citoyennes.",submitText:"Accéder à MIA",sideEyebrow:"PENSER ET RÉDIGER",sideTitle:"Clarifier.\nArgumenter. Écrire.",sideTag:"MIA · ACCOMPAGNEMENT"}
};


function getPostLoginPath() {
  const raw = new URLSearchParams(window.location.search).get("next") || "/workspace";
  try {
    const target = new URL(raw, window.location.origin);
    return target.origin === window.location.origin
      ? `${target.pathname}${target.search}${target.hash}`
      : "/workspace";
  } catch {
    return "/workspace";
  }
}

export default function LoginForm({ initialAuthContext }: { initialAuthContext: AuthContext }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [authContext] = useState<AuthContext>(initialAuthContext);
  const context = AUTH_CONTEXTS[authContext];
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage("La connexion à la base de données n'est pas encore configurée.");
      return;
    }

    if (mode === "signup" && password.length < 10) {
      setErrorMessage("Veuillez choisir un mot de passe d'au moins 10 caractères.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(getPostLoginPath());
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getPostLoginPath())}`,
            data: { display_name: displayName.trim() || null }
          }
        });
        if (error) throw error;

        if (data.session && data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            display_name: displayName.trim() || null,
            preferred_language: "fr"
          });
          router.replace(getPostLoginPath());
          router.refresh();
        } else {
          setNotice("Votre demande de compte a été enregistrée. Consultez votre messagerie pour confirmer votre adresse avant de vous connecter.");
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue.";
      setErrorMessage(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={`auth-page auth-${authContext}`}>
      <section className="auth-card">
        <div className="auth-navigation-row"><PageNavigation /></div>
        <a className="brand auth-brand" href="/" aria-label="OMNIA, accueil">
          <span className="brand-mark omnia-auth-mark"><img src="/omnia-logo.svg" alt="" /></span>
          <span className="brand-copy"><strong>OMNIA</strong><small>INTELLIGENCES EN SYNERGIE</small></span>
        </a>

        <p className="auth-service-kicker">{context.eyebrow}</p>
        <div className="auth-intro">
          <p className="eyebrow">MALAGASY INTELLIGENT ASSISTANT</p>
          <h1>{mode === "signin" ? context.signInTitle : context.signUpTitle}</h1>
          <p>{context.description}</p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Accès au compte">
          <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "selected" : ""} onClick={() => { setMode("signin"); setErrorMessage(""); setNotice(""); }}>Se connecter</button>
          <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setErrorMessage(""); setNotice(""); }}>Créer un compte</button>
        </div>

        {errorMessage && <div className="auth-alert error" role="alert">{errorMessage}</div>}
        {notice && <div className="auth-alert success" role="status">{notice}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="auth-field">
              <label htmlFor="display-name">Nom affiché <span>(facultatif)</span></label>
              <input id="display-name" type="text" autoComplete="name" maxLength={100} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Votre nom" />
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="email">Adresse e-mail</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nom@exemple.com" />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={mode === "signup" ? 10 : 1} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "signup" ? "10 caractères minimum" : "Votre mot de passe"} />
            {mode === "signup" && <small>Choisissez une phrase de passe longue et unique.</small>}
          </div>
          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Veuillez patienter…" : mode === "signin" ? context.submitText : "Créer mon compte"}
            {!busy && <span>→</span>}
          </button>
        </form>

        <div className="auth-assurance">
          <span>▣</span>
          <p>Chaque compte dispose d'un espace privé. Vos documents et conversations ne sont pas partagés avec les autres comptes.</p>
        </div>
        <p className="auth-foot">Les projets de documents restent soumis à la vérification du personnel habilité. OMNIA ne signe ni n'authentifie aucun acte officiel.</p>
      </section>

      <div className="auth-side">
        <div className="auth-side-orbit orbit-a" />
        <div className="auth-side-orbit orbit-b" />
        <div className="auth-side-content">
          <span className="auth-side-star">✦</span>
          <p>{context.sideEyebrow}</p>
          <h2>{context.sideTitle}</h2>
          <span className="auth-side-tag">{context.sideTag}</span>
        </div>
        <div className="auth-side-bottom">SYGEC-IA · PORTAIL PRIVÉ</div>
      </div>
    </main>
  );
}
