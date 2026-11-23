"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MioraWorkspace from "@/components/miora/miora-workspace";
import FelixWorkspace from "@/components/felix/felix-workspace";
import PageNavigation from "@/components/navigation/page-navigation";

type Section = "workspace" | "miora" | "maths" | "felix" | "mia" | "research" | "education" | "accounting" | "library" | "documents" | "history";
type Agent = { id: Section; name: string; specialty: string; color: string; symbol: string; status: string };
const agents: Agent[] = [
  { id: "workspace", name: "OMNIA", specialty: "Intelligence centrale", color: "omnia", symbol: "✦", status: "Orchestration" },
  { id: "miora", name: "MIORA", specialty: "Gestion communale · CTD", color: "miora", symbol: "⌂", status: "Fondation intégrée" },
  { id: "felix", name: "FELIX", specialty: "Terminale T12 · Gestion pédagogique", color: "felix", symbol: "F", status: "Gestionnaire T12" },
  { id: "mia", name: "MIA", specialty: "Philosophie · rédaction", color: "mia", symbol: "◉", status: "Fondation intégrée" },
  { id: "research", name: "Recherche", specialty: "Analyse documentaire", color: "research", symbol: "⌕", status: "Bibliothèque" },
  { id: "education", name: "Référentiel T12", specialty: "Terminale T12 · L / S / OSE", color: "education", symbol: "▣", status: "Référentiel pédagogique" }
];
const navigation: { id: Section; label: string; marker: string }[] = [
  { id: "workspace", label: "Vue d'ensemble", marker: "⌂" },
  { id: "research", label: "Recherche", marker: "⌕" },
  { id: "felix", label: "Terminale T12 · FELIX", marker: "▣" },
  { id: "accounting", label: "Finances OMNIA", marker: "◈" },
  { id: "library", label: "Bibliothèque", marker: "▥" },
  { id: "documents", label: "Mes documents", marker: "▧" },
  { id: "history", label: "Historique", marker: "◷" }
];
const sectionCopy: Record<Section, { eyebrow: string; title: string; text: string }> = {
  workspace: { eyebrow: "UN ÉCOSYSTÈME D'INTELLIGENCES", title: "Bienvenue dans OMNIA.", text: "Toutes les intelligences, réunies dans un même espace. Choisissez un spécialiste ou laissez OMNIA orienter votre demande." },
  miora: { eyebrow: "INTELLIGENCE SPÉCIALISÉE · CTD", title: "MIORA — Gestion communale", text: "L'expertise des collectivités territoriales décentralisées : budget, administration, performance et documents." },
  maths: { eyebrow: "ESPACE PÉDAGOGIQUE · TERMINALE T12", title: "Mathématiques — T12", text: "Ressources, progressions et exercices destinés aux élèves de Terminale T12." },
  felix: { eyebrow: "ESPACE PÉDAGOGIQUE · TERMINALE T12", title: "FELIX — Enseignement & suivi de Terminale T12", text: "Gérez exclusivement les parcours T12 L, T12 S et T12 OSE : inscriptions, cours, calendrier, suivi pédagogique et comptabilité de l’espace d’apprentissage." },
  mia: { eyebrow: "INTELLIGENCE SPÉCIALISÉE · MIA", title: "MIA — Penser, écrire et vous accompagner", text: "Philosophie, argumentation, rédaction structurée et accompagnement des demandes d’actes d’état civil." },
  research: { eyebrow: "INTELLIGENCE DOCUMENTAIRE", title: "Recherche & analyse", text: "Explorez, comparez et analysez les ressources intégrées à votre bibliothèque." },
  education: { eyebrow: "RÉFÉRENTIEL PÉDAGOGIQUE · T12", title: "Terminale T12 — Parcours L, S et OSE", text: "Références, matières et ressources pédagogiques réservées aux trois parcours de Terminale T12." },
  accounting: { eyebrow: "GESTION DE LA PLATEFORME", title: "Finances OMNIA", text: "Suivi des abonnements, recettes, dépenses, factures et rapports financiers de la plateforme." },
  library: { eyebrow: "BASE DOCUMENTAIRE", title: "Bibliothèque", text: "Textes, manuels, procédures et modèles intégrés à votre espace." },
  documents: { eyebrow: "ESPACE PERSONNEL", title: "Mes documents", text: "Retrouvez vos brouillons, analyses et documents de travail." },
  history: { eyebrow: "SUIVI DES ACTIVITÉS", title: "Historique", text: "Consultez vos échanges et travaux dans OMNIA." }
};
const academicAgents = [
  { subject: "Mathématiques", assistant: "Assistant pédagogique T12", status: "À créer", detail: "Raisonnement, calcul, démonstrations, exercices et résolution de problèmes selon le programme T12.", tone: "planned" },
  { subject: "Philosophie", assistant: "MIA", status: "Fondation intégrée", detail: "Notions, problématisation, argumentation, explication de textes et dissertation.", tone: "ready" },
  { subject: "Sciences économiques et sociales", assistant: "IA SES", status: "À créer", detail: "Économie, société, analyse et méthodes des sciences sociales.", tone: "planned" },
  { subject: "Physique / Chimie", assistant: "IA Physique-Chimie", status: "À créer", detail: "Lois physiques, phénomènes, chimie et exercices.", tone: "planned" },
  { subject: "Sciences de la vie et de la Terre", assistant: "IA SVT", status: "À créer", detail: "Sciences du vivant et de la Terre, schémas et analyse de documents.", tone: "planned" },
  { subject: "Histoire / Géographie", assistant: "IA Histoire-Géo", status: "À créer", detail: "Repères historiques, géographie, cartes et analyse documentaire.", tone: "planned" },
  { subject: "Malagasy", assistant: "IA Malagasy", status: "À créer", detail: "Langue, littérature, expression et culture malagasy.", tone: "planned" },
  { subject: "Français", assistant: "IA Français", status: "À créer", detail: "Langue, littérature, compréhension et expression écrite et orale.", tone: "planned" },
  { subject: "Anglais", assistant: "IA Anglais", status: "À créer", detail: "Compréhension, expression, grammaire et pratique de la langue.", tone: "planned" },
  { subject: "Éducation physique et sportive", assistant: "IA EPS", status: "À créer", detail: "Connaissances et apprentissages en éducation physique et sportive.", tone: "planned" }
];
const academicTracks = [
  { code: "T12_L", label: "Lettres et sciences humaines" },
  { code: "T12_S", label: "Sciences et expérimentation" },
  { code: "T12_OSE", label: "Organisation, société et économie" }
];
const quickActions = [
  { icon: "⌕", title: "Faire une recherche", description: "Explorer un texte ou une ressource.", prompt: "Je souhaite effectuer une recherche documentaire." },
  { icon: "▧", title: "Analyser un document", description: "Comprendre, vérifier et résumer.", prompt: "Je souhaite analyser un document." },
  { icon: "✎", title: "Rédiger", description: "Préparer un texte clair et structuré.", prompt: "Aidez-moi à rédiger un document." },
  { icon: "⌂", title: "Ouvrir MIORA", description: "Gestion communale et CTD.", prompt: "Je souhaite travailler avec MIORA sur la gestion d'une CTD." }
];
const ctdModules = [
  { title: "Budget primitif", desc: "Prévisions, recettes, dépenses et annexes", icon: "▤" },
  { title: "Budget additionnel", desc: "Reports et ajustements budgétaires", icon: "＋" },
  { title: "Budget rectificatif", desc: "Modifications et mouvements de crédits", icon: "⇄" },
  { title: "Compte administratif", desc: "Exécution, réalisations et résultats", icon: "▧" },
  { title: "Administration & actes", desc: "Délibérations, dossiers et suivi", icon: "§" },
  { title: "Personnel", desc: "Agents, paie et indemnités", icon: "♙" },
  { title: "Patrimoine", desc: "Inventaire, dette et immobilisations", icon: "⌂" },
  { title: "Performance", desc: "Programmes, actions et indicateurs", icon: "↗" }
];

function OmniaMark({ size = 42 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Logo OMNIA" className="omnia-mark">
    <defs><linearGradient id="omniaGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#92a7ff"/><stop offset=".55" stopColor="#b28cff"/><stop offset="1" stopColor="#5fe0d3"/></linearGradient></defs>
    <circle cx="50" cy="50" r="36" fill="none" stroke="url(#omniaGradient)" strokeWidth="5" strokeDasharray="170 56" transform="rotate(-32 50 50)"/>
    <ellipse cx="50" cy="50" rx="19" ry="38" fill="none" stroke="url(#omniaGradient)" strokeWidth="3" transform="rotate(55 50 50)"/>
    <ellipse cx="50" cy="50" rx="19" ry="38" fill="none" stroke="url(#omniaGradient)" strokeWidth="3" transform="rotate(-55 50 50)"/>
    <circle cx="50" cy="50" r="8" fill="#f4f6ff"/><circle cx="50" cy="50" r="4" fill="#7664d8"/>
    <circle cx="16" cy="50" r="4" fill="#67d8cc"/><circle cx="84" cy="50" r="4" fill="#a18bff"/><circle cx="50" cy="14" r="4" fill="#a18bff"/>
  </svg>;
}
function AgentMark({ agent, large = false }: { agent: Agent; large?: boolean }) {
  return <span className={`agent-mark ${agent.color} ${large ? "large" : ""}`}><span>{agent.symbol}</span></span>;
}

export default function WorkspaceClient({ userEmail, userRole, initialAgent = "workspace", initialIntent }: { userEmail: string; userRole: string; initialAgent?: Section; initialIntent?: "civil" }) {
  const router = useRouter();
  const startingSection: Section = initialIntent === "civil" ? "mia" : initialAgent;
  const [activeSection, setActiveSection] = useState<Section>(startingSection);
  const [selectedAgent, setSelectedAgent] = useState<Section>(startingSection);
  const [language, setLanguage] = useState<"FR" | "MG">("FR");
  const [input, setInput] = useState("");
  const conversationHistory = useRef<Record<string, UIMessage[]>>({});
  const [historyReadyFor, setHistoryReadyFor] = useState<Section>(startingSection);
  const chatTransport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );
  const { messages, sendMessage: sendAIMessage, status, error, setMessages, stop } = useChat({ transport: chatTransport });

  useEffect(() => {
    if (historyReadyFor === selectedAgent) return;
    stop();
    setMessages(conversationHistory.current[selectedAgent] ?? []);
    setHistoryReadyFor(selectedAgent);
  }, [selectedAgent, historyReadyFor, setMessages, stop]);

  useEffect(() => {
    if (historyReadyFor !== selectedAgent) return;
    conversationHistory.current[selectedAgent] = messages;
  }, [messages, selectedAgent, historyReadyFor]);
  const copy = activeSection === "mia" && isCivilContext
    ? {
        eyebrow: "ACCOMPAGNEMENT CITOYEN · MIA",
        title: "MIA — Demande d’acte de naissance",
        text: "Bonjour, je suis MIA. Je vous accompagne pour préparer une copie conforme, un nouvel acte de naissance ou la transcription d’un jugement supplétif."
      }
    : sectionCopy[activeSection];
  const isCivilContext = initialIntent === "civil";
  const displayedAgents = agents.map((agent) =>
    isCivilContext && agent.id === "mia"
      ? { ...agent, specialty: "Actes de naissance · État civil", status: "Accompagnement citoyen" }
      : agent
  );
  const currentAgent = displayedAgents.find((a) => a.id === selectedAgent) ?? displayedAgents[0];

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }
  function selectAgent(id: Section) {
    setSelectedAgent(id);
    setActiveSection(id);
  }
  function sendMessage(event?: FormEvent<HTMLFormElement>, preset?: string) {
    event?.preventDefault();
    const text = (preset ?? input).trim();
    if (!text || status !== "ready") return;
    sendAIMessage({ text }, {
      body: {
        assistantId: selectedAgent,
        assistantIntent: selectedAgent === "mia" && initialIntent === "civil" ? "civil" : null
      }
    });
    setInput("");
  }
  function openAgent(agent: Agent) {
    selectAgent(agent.id);
    setInput("");
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="/workspace" aria-label="OMNIA, accueil">
        <span className="brand-symbol"><OmniaMark size={43}/></span>
        <span className="brand-copy"><strong>OMNIA</strong><small>INTELLIGENCE EN SYNERGIE</small></span>
      </a>
      <div className="workspace-label">INTELLIGENCES SPÉCIALISÉES</div>
      <div className="agent-list">
        {displayedAgents.map((agent) => <button key={agent.id} type="button" className={selectedAgent === agent.id ? `agent-choice active ${agent.color}` : `agent-choice ${agent.color}`} onClick={() => openAgent(agent)}>
          <AgentMark agent={agent}/><span className="agent-choice-copy"><strong>{agent.name}</strong><small>{agent.specialty}</small></span><span className="agent-indicator" />
        </button>)}
      </div>
      <div className="sidebar-divider" />
      <div className="workspace-label">MENU PRINCIPAL</div>
      <nav className="side-nav" aria-label="Navigation principale">
        {navigation.map((item) => item.id === "library" ? <a className="nav-item" href="/library" key={item.id}><span className="nav-marker">{item.marker}</span><span>{item.label}</span></a> : <button type="button" key={item.id} className={activeSection === item.id ? "nav-item active" : "nav-item"} onClick={() => selectAgent(item.id)} aria-current={activeSection === item.id ? "page" : undefined}><span className="nav-marker">{item.marker}</span><span>{item.label}</span>{activeSection === item.id && <span className="nav-active-dot"/>}</button>)}
        {(userRole === "owner" || userRole === "admin") && <a className="nav-item" href="/admin"><span className="nav-marker">⚙</span><span>Administration</span></a>}
      </nav>
      <div className="sidebar-spacer"/>
      <div className="sidebar-note"><span className="note-spark">✦</span><p>« Toute l'intelligence. Une seule vision. »</p></div>
      <div className="profile-row"><div className="profile-avatar">{(userEmail || "O").slice(0,1).toUpperCase()}</div><div className="profile-copy"><strong>{userEmail || "Mon espace"}</strong><small>{userRole === "owner" ? "Propriétaire OMNIA" : userRole === "admin" ? "Administrateur" : "Compte sécurisé"}</small></div><button className="logout-button" type="button" onClick={handleSignOut}>Quitter</button></div>
    </aside>

    <section className="main-panel">
      <header className="topbar"><div className="breadcrumb"><span>OMNIA</span><b>/</b><strong>{navigation.find((n) => n.id === activeSection)?.label ?? currentAgent.name}</strong></div><div className="topbar-right"><PageNavigation compact/><span className="status-pill"><i/> Écosystème actif</span><button className="language-toggle" type="button" onClick={() => setLanguage(language === "FR" ? "MG" : "FR")}>{language === "FR" ? "FR  ↔  MG" : "MG  ↔  FR"}</button><button className="help-button" type="button" onClick={() => setActiveSection("workspace")} aria-label="Aide">?</button></div></header>
      <div className="content-wrap">
        <div className="welcome-row"><div><p className="eyebrow">{copy.eyebrow}</p><h1>{language === "FR" ? copy.title : "Tongasoa eto OMNIA."}</h1><p className="welcome-text">{language === "FR" ? copy.text : "Faharanitan-tsaina maro, sehatra iray."}</p></div><div className="welcome-badge"><OmniaMark size={38}/><div className="badge-caption"><strong>{currentAgent.name}</strong><small>{currentAgent.status}</small></div></div></div>

      {activeSection === "workspace" ? <>
        <section className="hero-card omnia-hero"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-content"><span className="hero-kicker"><span>✦</span> TOUTES LES INTELLIGENCES · UN SEUL UNIVERS</span><h2>Une vision globale.<br/>Des expertises singulières.</h2><p>OMNIA réunit des intelligences spécialisées pour vous aider à chercher, comprendre, créer et décider avec plus de clarté.</p><button className="primary-button" type="button" onClick={() => document.getElementById("omnia-input")?.focus()}>Commencer une conversation <span>→</span></button></div><div className="hero-decoration"><div className="deco-ring ring-a"/><div className="deco-ring ring-b"/><div className="deco-star"><OmniaMark size={120}/></div><span className="deco-caption">KNOWLEDGE<br/>IN SYNERGY</span></div></section>
        <div className="section-heading"><div><p className="eyebrow">VOTRE ÉCOSYSTÈME</p><h2>Choisissez une intelligence.</h2></div><span className="subtle-label">6 ESPACES</span></div>
        <div className="agent-cards">{displayedAgents.map((agent) => <button key={agent.id} className={`agent-card ${agent.color}`} type="button" onClick={() => openAgent(agent)}><div className="agent-card-top"><AgentMark agent={agent} large/><span className="agent-arrow">↗</span></div><strong>{agent.name}</strong><span className="agent-specialty">{agent.specialty}</span><p>{agent.id === "workspace" ? "Coordonne et oriente votre demande vers la bonne expertise." : agent.id === "miora" ? "Budgets, administration, patrimoine et performance des CTD." : agent.id === "felix" ? "Gestion exclusive de Terminale T12 : parcours L, S et OSE, cours, calendrier, suivi pédagogique et comptabilité." : agent.id === "maths" ? "Résolution guidée, calculs et démonstrations." : agent.id === "mia" ? (isCivilContext ? "Copie conforme, nouvel acte de naissance et transcription d’un jugement supplétif." : "Philosophie et rédaction structurée.") : agent.id === "research" ? "Recherche dans les ressources et analyse de documents." : "Référentiel des matières et parcours de Terminale T12."}</p><span className="agent-card-status">{agent.status}</span></button>)}</div>
        <div className="section-heading"><div><p className="eyebrow">POUR COMMENCER</p><h2>Accès rapides</h2></div></div><div className="action-grid">{quickActions.map((action,index)=><button className="action-card" type="button" key={action.title} onClick={() => sendMessage(undefined,action.prompt)}><span className={`action-icon icon-${index}`}>{action.icon}</span><span className="action-title">{action.title}</span><span className="action-description">{action.description}</span><span className="action-arrow">↗</span></button>)}</div>
        <div className="bottom-grid"><section className="recent-card"><div className="card-heading"><div><p className="eyebrow">VOTRE ACTIVITÉ</p><h3>Reprendre le fil</h3></div><span className="quiet-tag">RÉCENT</span></div><div className="empty-activity"><span className="empty-icon">◷</span><div><strong>Votre espace est prêt.</strong><p>Vos recherches et conversations apparaîtront ici au fur et à mesure.</p></div></div></section><section className="principle-card"><span className="principle-icon">✧</span><div><p className="eyebrow">NOTRE ENGAGEMENT</p><h3>La rigueur avant tout.</h3><p>Les intelligences distinguent les sources, les hypothèses et les analyses. La validation humaine reste essentielle.</p></div></section></div>
      </> : activeSection === "miora" ? <MioraWorkspace onAsk={(prompt) => sendMessage(undefined, prompt)} storageScope={userEmail} /> : activeSection === "felix" ? <FelixWorkspace userRole={userRole} /> : activeSection === "accounting" ? <section className="section-placeholder"><div className="placeholder-symbol">◈</div><p className="eyebrow">GESTION COMMUNALE · CTD</p><h2>Finances et administration des collectivités.</h2><p>Accédez à l’interface historique de gestion communale conservée pendant la migration. MIORA reste l’espace métier spécialisé dans les budgets, le personnel, le patrimoine et la performance des CTD.</p><a className="secondary-button" href="/gestion-communale.html">Ouvrir l’interface complète de gestion CTD ↗</a><p className="welcome-text">Les données de cette interface historique ne sont pas automatiquement synchronisées avec les brouillons MIORA ni avec Supabase.</p></section> : activeSection === "education" ? <section className="academy-panel"><div className="academy-intro"><div><p className="eyebrow">ÉQUIPE PÉDAGOGIQUE IA</p><h2>Une intelligence pour chaque matière.</h2><p>Chaque agent enseignera à partir du programme éducatif, des cours et documents de référence intégrés.</p></div><div className="academy-count"><strong>{academicAgents.length}</strong><span>matières<br/>répertoriées</span></div></div><div className="academy-tracks">{academicTracks.map(track=><div className="academy-track" key={track.code}><strong>{track.code}</strong><span>{track.label}</span></div>)}</div><div className="academy-grid">{academicAgents.map(agent=><article className="academy-card" key={agent.subject}><div className="academy-card-top"><span className="academy-symbol">✦</span><span className={agent.tone==="ready"?"academy-status ready":"academy-status planned"}>{agent.status}</span></div><h3>{agent.subject}</h3><p className="academy-agent">{agent.assistant}</p><p className="academy-detail">{agent.detail}</p></article>)}</div><div className="academy-note"><strong>Expertises transversales</strong><span>MIORA : comptabilité et gestion financière des CTD.</span><span>MIA : philosophie et rédaction.</span></div><p className="academy-footnote">Périmètre initial : Terminale (T12). Alignement à confirmer à partir des PE, RAPE et FRP officiels.</p></section> : activeSection === "maths" || activeSection === "mia" ? <section className="specialist-panel"><AgentMark agent={currentAgent} large/><p className="eyebrow">ESPACE SPÉCIALISÉ</p><h2>{currentAgent.name}</h2><p>{copy.text}</p><div className="specialist-focus">{activeSection === "maths" ? <><strong>Assistant pédagogique · Mathématiques T12</strong><span>• Explications étape par étape</span><span>• Vérification des calculs</span><span>• Exercices et méthodes de Terminale T12</span></> : isCivilContext ? <><strong>MIA · Actes de naissance</strong><span>• Copie conforme ou renouvellement d’un acte existant (Kopia manontolo)</span><span>• Préparation d’un nouvel acte de naissance (Sora-pahaterahana vaovao)</span><span>• Transcription d’un jugement supplétif (Kopia Fandikana)</span><span>• Projet soumis au contrôle et à la validation de l’officier d’état civil</span></> : <><strong>MIA</strong><span>• Problématisation philosophique</span><span>• Concepts et argumentation</span><span>• Dissertation et rédaction</span></>}</div><button className="secondary-button" type="button" onClick={() => document.getElementById("omnia-input")?.focus()}>Commencer une séance</button></section> : <section className="section-placeholder"><div className="placeholder-symbol">{navigation.find(n=>n.id===activeSection)?.marker}</div><p className="eyebrow">ESPACE EN PRÉPARATION</p><h2>{copy.title}</h2><p>{copy.text}</p><div className="placeholder-info"><span>✦</span> Cet espace sera activé progressivement à mesure que les ressources et modèles seront intégrés.</div><button className="secondary-button" type="button" onClick={() => setActiveSection("workspace")}>Revenir à OMNIA</button></section>}
      </div>
    </section>

    <aside className="assistant-panel"><div className="assistant-header"><div className="assistant-heading"><AgentMark agent={currentAgent}/><div><strong>Conversation · {currentAgent.name}</strong><small><i/> Espace connecté</small></div></div><button className="panel-menu" type="button" aria-label="Options">···</button></div><div className="conversation-label"><span>AUJOURD'HUI</span></div><div className="message-list" aria-live="polite">{messages.map(message=><div key={message.id} className={message.role==="assistant"?"message-row mia-message":"message-row user-message"}>{message.role==="assistant"&&<div className="message-avatar"><OmniaMark size={22}/></div>}<div className="message-bubble">{message.role==="assistant"&&<strong className="message-author">{currentAgent.name}</strong>}{message.parts.map((part,index)=>part.type==="text"?<p key={index}>{part.text}</p>:null)}{message.role==="assistant" && status==="ready" && !message.parts.some(part=>part.type==="text" && part.text.trim()) && <p className="empty-assistant-note">Cette réponse a été bloquée par le contrôle de sécurité ou n’a pas produit de texte. Reformulez votre demande puis réessayez.</p>}</div></div>)}{(status==="submitted"||status==="streaming")&&<div className="message-row mia-message"><div className="message-avatar"><OmniaMark size={22}/></div><div className="message-bubble"><strong className="message-author">{currentAgent.name}</strong><p>Je prépare votre réponse…</p></div></div>}{error&&<div className="chat-error" role="alert">La réponse n’a pas pu être générée. La connexion au moteur conversationnel a échoué. Réessayez dans un instant.</div>}</div><div className="suggestion-area"><p>POUR VOUS INSPIRER</p><button type="button" onClick={()=>sendMessage(undefined,"Explique-moi comment tu peux m'aider et quelles sont tes limites.")}>Découvrir les capacités de {currentAgent.name}<span>↗</span></button><button type="button" onClick={()=>sendMessage(undefined,"Aide-moi à structurer ma demande et indique les informations manquantes.")}>Structurer ma demande<span>↗</span></button></div><form className="chat-composer" onSubmit={event=>sendMessage(event)}><label className="sr-only" htmlFor="omnia-input">Écrire un message à {currentAgent.name}</label><textarea id="omnia-input" value={input} onChange={event=>setInput(event.target.value)} placeholder={`Écrivez à ${currentAgent.name}…`} rows={2} onKeyDown={event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();sendMessage();}}}/><div className="composer-footer"><span>FR · MG <i/> Sources et rigueur</span><button className="send-button" type="submit" disabled={!input.trim()||status!=="ready"} aria-label="Envoyer le message">↑</button></div></form><p className="privacy-note"><span>▣</span> Vérifiez toujours les documents avant tout usage officiel.</p></aside>
  </main>;
}
