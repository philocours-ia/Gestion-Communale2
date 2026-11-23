"use client";

import Link from "next/link";
import { useState } from "react";

function Icon({ name }: { name: "home" | "building" | "school" | "document" | "info" | "mail" | "shield" | "spark" | "book" }) {
  const shared = { fill:"none", stroke:"currentColor", strokeWidth:1.8, strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
  if (name==="home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" {...shared}/></svg>;
  if (name==="building") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-8h6v8M9 9h.01M15 9h.01" {...shared}/></svg>;
  if (name==="school") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5L2 9ZM6 12v5c3.5 3 8.5 3 12 0v-5M22 9v7" {...shared}/></svg>;
  if (name==="document") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v5h5M9 12h6M9 16h6" {...shared}/></svg>;
  if (name==="info") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" {...shared}/><path d="M12 11v5M12 7h.01" {...shared}/></svg>;
  if (name==="mail") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" {...shared}/><path d="m4 7 8 6 8-6" {...shared}/></svg>;
  if (name==="shield") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6zM8.5 12l2.2 2.2 4.8-5" {...shared}/> </svg>;
  if (name==="book") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v18H7.5A3.5 3.5 0 0 0 4 23zM4 5.5v17M8 6h8M8 10h8" {...shared}/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" {...shared}/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" {...shared}/></svg>;
}

function RobotMascot() {
  return <svg className="omnia-robot" viewBox="0 0 360 380" role="img" aria-label="Mascotte robot d’OMNIA">
    <defs><linearGradient id="rb-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f6fcff"/><stop offset=".5" stopColor="#7897ca"/><stop offset="1" stopColor="#1d3566"/></linearGradient><linearGradient id="rb-blue"><stop stopColor="#83f5ff"/><stop offset="1" stopColor="#1689ff"/></linearGradient><filter id="rb-glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <ellipse cx="180" cy="350" rx="110" ry="15" fill="#158fff" opacity=".25"/>
    <path d="M92 322c-9-51 8-96 38-113h101c31 19 45 62 36 113l-17 24H110z" fill="url(#rb-metal)" stroke="#a1efff" strokeWidth="5"/>
    <path d="M121 236c15-15 35-23 60-23s45 8 60 23l-11 78H132z" fill="#091630" stroke="#3daeff" strokeWidth="4"/>
    <path d="M134 270q20-18 47-18t47 18l-47 28z" fill="url(#rb-blue)" filter="url(#rb-glow)"/>
    <path d="M110 253 71 290l18 27 42-24M250 253l40 38-18 26-43-24" fill="url(#rb-metal)" stroke="#8be9ff" strokeWidth="6"/>
    <path d="M113 116c0-49 28-82 67-82s67 33 67 82v65c0 42-26 68-67 68s-67-26-67-68z" fill="url(#rb-metal)" stroke="#b4f6ff" strokeWidth="5"/>
    <path d="M130 125c0-34 21-55 50-55s50 21 50 55v46c0 33-18 51-50 51s-50-18-50-51z" fill="#07142b" stroke="#49bfff" strokeWidth="4"/>
    <path d="M148 144q10-12 20 0M183 144q10-12 20 0" stroke="#72edff" strokeWidth="8" strokeLinecap="round" fill="none" filter="url(#rb-glow)"/>
    <path d="M158 177q22 18 44 0" stroke="#72edff" strokeWidth="6" strokeLinecap="round" fill="none"/>
    <path d="M180 34V10m-10 13 10-13 10 13" stroke="#8ceeff" strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#rb-glow)"/>
  </svg>;
}

const links = {
  miora:"/login?next=%2Fworkspace%3Fagent%3Dmiora",
  felix:"/login?next=%2Fworkspace%3Fagent%3Dfelix",
  mia:"/login?next=%2Fworkspace%3Fagent%3Dmia%26intent%3Dcivil"
};

export default function OmniaHome() {
  const [aboutOpen,setAboutOpen]=useState(false);
  return <main className="omnia-shell">
    <aside className="omnia-rail">
      <Link href="/" className="omnia-rail-brand" aria-label="SYGEC-IA OMNIA, accueil"><img src="/omnia-logo.svg" alt=""/><span><small>SYGEC-IA</small><strong>OMNIA</strong><em>Intelligence • Service • Excellence</em></span></Link>
      <p className="omnia-rail-label">NAVIGATION</p>
      <nav className="omnia-rail-nav" aria-label="Navigation principale">
        <Link href="/" className="active"><Icon name="home"/>Accueil</Link>
        <Link href={links.miora}><Icon name="building"/>Gestion CTD<small>MIORA</small></Link>
        <Link href={links.felix}><Icon name="school"/>Enseignement<small>FELIX · T12</small></Link>
        <Link href={links.mia}><Icon name="document"/>Demande d’Acte d’État Civil<small>MIA</small></Link>
      </nav>
      <div className="omnia-rail-separator"/>
      <nav className="omnia-rail-meta" aria-label="Informations">
        <button type="button" onClick={()=>setAboutOpen(true)}><Icon name="info"/>À propos</button>
        <button type="button" onClick={()=>setAboutOpen(true)}><Icon name="mail"/>Contact</button>
        <Link href="/login"><Icon name="shield"/>Espace connecté</Link>
      </nav>
      <div className="omnia-rail-bottom"><div className="omnia-mada-mark">✦</div><strong>SYGEC-IA · OMNIA</strong><p>Une plateforme intelligente au service des projets, des savoirs et des citoyens.</p><span>ENSEMBLE, VERS UN AVENIR MEILLEUR</span></div>
    </aside>

    <div className="omnia-main">
      <header className="omnia-topbar"><div><i/> UNE INTELLIGENCE PLURIELLE POUR GÉRER, ENSEIGNER ET RÉDIGER</div><Link href="/login" className="omnia-top-login"><Icon name="shield"/>Se connecter <b>↗</b></Link></header>
      <section className="omnia-hero">
        <div className="omnia-hero-copy">
          <p className="omnia-eyebrow"><Icon name="spark"/> VOTRE UNIVERS NUMÉRIQUE</p>
          <h1>SYGEC-IA <span>• OMNIA</span></h1>
          <h2>La technologie au service de vos ambitions.</h2>
          <p>Une intelligence centrale, des assistants spécialisés et des espaces de travail conçus pour transformer vos idées en actions structurées.</p>
          <div className="omnia-hero-actions"><Link href="/login" className="omnia-primary-action">Entrer dans OMNIA <b>→</b></Link><button type="button" className="omnia-secondary-action" onClick={()=>setAboutOpen(true)}>Découvrir la plateforme</button></div>
          <div className="omnia-hero-proof"><span><Icon name="shield"/> Espaces privés</span><span><Icon name="spark"/> Assistants spécialisés</span><span><Icon name="book"/> Ressources documentaires</span></div>
        </div>
        <div className="omnia-hero-art" aria-hidden="true">
          <div className="omnia-city-skyline"><i/><i/><i/><i/><i/><i/><i/></div>
          <svg className="omnia-lightning lightning-a" viewBox="0 0 120 210"><path d="M80 2 24 104h48L39 208l77-130H72z" fill="none" stroke="#65dfff" strokeWidth="4"/></svg>
          <svg className="omnia-lightning lightning-b" viewBox="0 0 120 210"><path d="M80 2 24 104h48L39 208l77-130H72z" fill="none" stroke="#a28aff" strokeWidth="4"/></svg>
          <div className="omnia-hero-orbit orbit-one"/><div className="omnia-hero-orbit orbit-two"/><RobotMascot/>
          <div className="omnia-hero-caption"><span>OMNIA</span><strong>Votre guide intelligent</strong><small>Une porte d’entrée vers les bons outils.</small></div>
        </div>
      </section>

      <section className="omnia-services" aria-labelledby="omnia-services-title">
        <div className="omnia-section-head"><div><p>CHOISISSEZ VOTRE ESPACE</p><h2 id="omnia-services-title">Trois univers. Une seule plateforme.</h2></div><span>SYGEC-IA / SERVICES</span></div>
        <div className="omnia-service-grid">
          <Link className="omnia-service-card service-ctd" href={links.miora}>
            <div className="omnia-service-top"><span className="omnia-service-icon"><Icon name="building"/></span><span className="omnia-service-code">01 / MIORA</span></div>
            <p className="omnia-service-kicker">COLLECTIVITÉS TERRITORIALES</p><h3>Gestion CTD</h3>
            <p className="omnia-service-description">Budgets, comptabilité communale, administration, ressources humaines, patrimoine et pilotage local.</p>
            <span className="omnia-service-list"><b>✓</b> Documents structurés <b>✓</b> Appui administratif</span>
            <span className="omnia-service-cta">Accéder à MIORA <b>→</b></span>
          </Link>
          <Link className="omnia-service-card service-school" href={links.felix}>
            <div className="omnia-service-top"><span className="omnia-service-icon"><Icon name="school"/></span><span className="omnia-service-code">02 / FELIX</span></div>
            <p className="omnia-service-kicker">ESPACE PÉDAGOGIQUE · TERMINALE T12</p><h3>Enseignement</h3>
            <p className="omnia-service-description">Espace réservé à Terminale T12 : parcours L, S et OSE, cours, calendrier et suivi pédagogique.</p>
            <span className="omnia-service-list"><b>✓</b> Cours et ressources <b>✓</b> Inscriptions et suivi</span>
            <span className="omnia-service-cta">Accéder à FELIX <b>→</b></span>
          </Link>
          <Link className="omnia-service-card service-civil" href={links.mia}>
            <div className="omnia-service-top"><span className="omnia-service-icon"><Icon name="document"/></span><span className="omnia-service-code">03 / MIA</span></div>
            <p className="omnia-service-kicker">ACCOMPAGNEMENT CITOYEN</p><h3>Demande d’Acte d’État Civil</h3>
            <p className="omnia-service-description">Clarifier une démarche, préparer une demande et identifier les points à confirmer auprès de la commune.</p>
            <span className="omnia-service-list"><b>✓</b> Naissance, mariage, décès <b>✓</b> Orientation</span>
            <span className="omnia-service-cta">Accéder à MIA <b>→</b></span>
          </Link>
        </div>
      </section>

      <section className="omnia-lower-grid">
        <div className="omnia-intelligences"><div className="omnia-lower-heading"><span>✦</span><div><p>LES INTELLIGENCES SPÉCIALISÉES</p><h2>Chacune a sa mission.</h2></div></div>
          <div className="omnia-agent-row"><div><i className="agent-omnia">✦</i><strong>OMNIA</strong><small>Accueil et orchestration</small></div><div><i className="agent-miora">⌂</i><strong>MIORA</strong><small>Gestion communale</small></div><div><i className="agent-felix">F</i><strong>FELIX</strong><small>Terminale T12</small></div><div><i className="agent-mia">◈</i><strong>MIA</strong><small>Philosophie et accompagnement</small></div></div>
        </div>
        <div className="omnia-assistant-teaser"><div className="omnia-assistant-avatar"><Icon name="spark"/></div><div><p>VOTRE GUIDE NUMÉRIQUE</p><h2>Besoin d’être orienté ?</h2><span>OMNIA vous aide à identifier l’espace adapté à votre demande.</span><Link href="/login?next=%2Fworkspace">Discuter avec OMNIA <b>→</b></Link></div></div>
      </section>
      <footer className="omnia-footer"><span>SYGEC-IA · OMNIA</span><span>Une intelligence plurielle pour gérer, enseigner et rédiger.</span><span>FR · MG</span></footer>
    </div>

    {aboutOpen && <div className="omnia-modal-backdrop" role="presentation" onClick={()=>setAboutOpen(false)}><section className="omnia-about-modal" role="dialog" aria-modal="true" aria-labelledby="omnia-about-title" onClick={e=>e.stopPropagation()}>
      <button type="button" className="omnia-modal-close" onClick={()=>setAboutOpen(false)} aria-label="Fermer">×</button>
      <p className="omnia-eyebrow"><Icon name="spark"/> À PROPOS DE SYGEC-IA</p><h2 id="omnia-about-title">Un portail. Plusieurs compétences.</h2>
      <p>OMNIA accueille les visiteurs et oriente chaque demande vers une intelligence spécialisée : MIORA pour la gestion des CTD, FELIX pour l’espace pédagogique Terminale T12, et MIA pour la philosophie, la rédaction et l’accompagnement citoyen.</p>
      <p>Les assistants aident à organiser, expliquer et préparer. Les documents et actes officiels restent soumis au contrôle des autorités habilitées.</p>
      <Link href="/login" className="omnia-primary-action">Accéder à la plateforme <b>→</b></Link>
    </section></div>}
  </main>;
}
