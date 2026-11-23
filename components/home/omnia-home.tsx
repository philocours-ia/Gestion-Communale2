"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const styles = [
  ".omnia-home{min-height:100vh;color:#f7f8ff;background:radial-gradient(circle at 80% 0%,#283d75 0,transparent 32%),radial-gradient(circle at 0% 80%,#173e48 0,transparent 30%),linear-gradient(135deg,#0c1428,#111c36 58%,#0b1424);padding:28px clamp(18px,5vw,74px) 48px}",
  ".omnia-home-inner{max-width:1180px;margin:0 auto}",
  ".omnia-home-header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}",
  ".omnia-home-brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit}",
  ".omnia-home-brand img{width:48px;height:48px;object-fit:contain}",
  ".omnia-home-brand small{display:block;color:#9fb6eb;font-size:10px;letter-spacing:.2em;font-weight:800}",
  ".omnia-home-brand strong{display:block;font-size:21px;letter-spacing:.1em}",
  ".omnia-home-header-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
  ".omnia-home-ghost,.omnia-home-login{min-height:44px;border-radius:12px;padding:10px 15px;font-size:12px;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;border:1px solid #6f83ad;color:#e8edff;background:#152342;cursor:pointer}",
  ".omnia-home-login{background:#4770d9;border-color:#4770d9;color:#fff}",
  ".omnia-home-hero{padding:clamp(48px,8vw,90px) 0 34px;max-width:850px}",
  ".omnia-home-eyebrow{color:#83ddd8;font-size:11px;font-weight:900;letter-spacing:.19em;text-transform:uppercase;margin:0 0 15px}",
  ".omnia-home-hero h1{font-size:clamp(36px,6vw,66px);line-height:1.04;letter-spacing:-.055em;margin:0 0 18px}",
  ".omnia-home-hero h1 span{color:#98b9ff}",
  ".omnia-home-hero p{max-width:760px;color:#c4cde0;font-size:16px;line-height:1.8;margin:0}",
  ".omnia-home-prompt{display:inline-flex;align-items:center;gap:8px;color:#d5e7ff;background:#1a2b4c;border:1px solid #5471a6;border-radius:999px;padding:8px 12px;margin-top:20px;font-size:11px;font-weight:800}",
  ".omnia-home-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0 0 46px}",
  ".omnia-home-card{display:flex;flex-direction:column;align-items:flex-start;min-height:265px;border:1px solid #405476;border-radius:20px;padding:22px;background:linear-gradient(145deg,#18294b,#141f39);box-shadow:0 14px 36px #0308174d}",
  ".omnia-home-card.teaching{background:linear-gradient(145deg,#282344,#1b203d);border-color:#615693}",
  ".omnia-home-card.civil{background:linear-gradient(145deg,#143941,#172b3e);border-color:#387d80}",
  ".omnia-home-icon{width:43px;height:43px;display:grid;place-items:center;border-radius:13px;background:#355483;color:#cfe3ff;font-size:21px;font-weight:900;margin-bottom:17px}",
  ".teaching .omnia-home-icon{background:#554b7d;color:#e5ddff}.civil .omnia-home-icon{background:#276c6a;color:#c8fff1}",
  ".omnia-home-card small{font-size:10px;letter-spacing:.13em;font-weight:900;color:#93c9ff;text-transform:uppercase}",
  ".teaching small{color:#d0baff}.civil small{color:#9de8d9}",
  ".omnia-home-card h2{font-size:22px;line-height:1.2;margin:9px 0;color:#fff}",
  ".omnia-home-card p{font-size:13px;line-height:1.7;color:#c3cee1;margin:0 0 22px}",
  ".omnia-home-card a{margin-top:auto;min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;border-radius:10px;background:#4770d9;color:white;text-decoration:none;font-size:12px;font-weight:850}",
  ".teaching a{background:#7865c4}.civil a{background:#238d82;color:#f7fffd}",
  ".omnia-home-card a:hover,.omnia-home-login:hover{filter:brightness(1.12)}",
  ".omnia-home-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 16px}",
  ".omnia-home-section-heading h2{font-size:21px;margin:5px 0 0;letter-spacing:-.03em}",
  ".omnia-home-section-heading p{font-size:10px;color:#9eacc8;letter-spacing:.14em;text-transform:uppercase;margin:0;font-weight:850}",
  ".omnia-home-ai-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}",
  ".omnia-home-ai{padding:17px;border-radius:15px;border:1px solid #344967;background:#111e36}",
  ".omnia-home-ai strong{display:block;font-size:14px;margin-bottom:4px}",
  ".omnia-home-ai small{display:block;color:#91b5ef;font-size:10px;font-weight:850;letter-spacing:.08em;margin-bottom:9px}",
  ".omnia-home-ai p{color:#adbdd5;font-size:11px;line-height:1.65;margin:0}",
  ".omnia-home-ai.omnia{border-color:#52669c}.omnia-home-ai.miora{border-color:#3c806e}.omnia-home-ai.mia{border-color:#635a9a}",
  ".omnia-home-footer{margin-top:32px;padding-top:18px;border-top:1px solid #344463;color:#8797b4;font-size:11px;line-height:1.7}",
  ".omnia-home-modal-backdrop{position:fixed;inset:0;z-index:1000;background:#050b18d9;display:grid;place-items:center;padding:18px}",
  ".omnia-home-modal{width:min(720px,100%);max-height:min(86vh,820px);overflow:auto;border:1px solid #5d729d;border-radius:20px;background:#111d36;color:#f5f7ff;box-shadow:0 24px 80px #0009;padding:clamp(20px,4vw,30px)}",
  ".omnia-home-modal-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}",
  ".omnia-home-modal h2{font-size:25px;line-height:1.2;margin:4px 0 12px}",
  ".omnia-home-modal p{font-size:13px;line-height:1.75;color:#c5cee0}",
  ".omnia-home-modal-close{width:44px;height:44px;flex:0 0 auto;border-radius:11px;border:1px solid #50648d;background:#1b2a49;color:#fff;font-size:22px;cursor:pointer}",
  ".omnia-home-modal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px}",
  ".omnia-home-modal-note{padding:13px;border-radius:12px;border:1px solid #354b70;background:#172642}",
  ".omnia-home-modal-note strong{display:block;font-size:12px;margin-bottom:5px}",
  ".omnia-home-modal-note span{font-size:11px;color:#bdc9df;line-height:1.6}",
  "@media(max-width:900px){.omnia-home-choices{grid-template-columns:1fr 1fr}.omnia-home-card:last-child{grid-column:1/-1}.omnia-home-ai-grid{grid-template-columns:1fr 1fr}}",
  "@media(max-width:600px){.omnia-home{padding:18px 14px 32px}.omnia-home-choices,.omnia-home-ai-grid,.omnia-home-modal-grid{grid-template-columns:1fr}.omnia-home-card:last-child{grid-column:auto}.omnia-home-hero{padding-top:52px}.omnia-home-hero p{font-size:14px}.omnia-home-header-actions{width:100%}.omnia-home-header-actions>*{flex:1}.omnia-home-card{min-height:220px}}"
].join("\n");

export default function OmniaHome() {
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    if (!aboutOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAboutOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [aboutOpen]);

  return (
    <main className="omnia-home">
      <style>{styles}</style>
      <div className="omnia-home-inner">
        <header className="omnia-home-header">
          <Link href="/" className="omnia-home-brand" aria-label="SYGEC-IA OMNIA, accueil">
            <img src="/omnia-logo.svg" alt="" />
            <span><small>SYGEC-IA</small><strong>OMNIA</strong></span>
          </Link>
          <div className="omnia-home-header-actions">
            <button type="button" className="omnia-home-ghost" onClick={() => setAboutOpen(true)} aria-haspopup="dialog" aria-expanded={aboutOpen}>
              Comprendre la plateforme
            </button>
            <Link href="/login" className="omnia-home-login">Se connecter <span aria-hidden="true">→</span></Link>
          </div>
        </header>

        <section className="omnia-home-hero">
          <p className="omnia-home-eyebrow">Une plateforme · Des intelligences spécialisées</p>
          <h1>Que souhaitez-vous faire <span>aujourd'hui&nbsp;?</span></h1>
          <p>SYGEC-IA réunit trois portes d’entrée. Choisissez votre besoin : OMNIA vous oriente vers l’assistant adapté et vous accompagne dans votre parcours.</p>
          <div className="omnia-home-prompt"><span aria-hidden="true">✦</span> OMNIA · Accueil et orientation intelligente</div>
        </section>

        <section className="omnia-home-choices" aria-label="Choisir un service">
          <article className="omnia-home-card">
            <span className="omnia-home-icon" aria-hidden="true">⌂</span>
            <small>MIORA · Collectivités territoriales</small>
            <h2>Gestion CTD</h2>
            <p>Budgets, comptabilité publique locale, procédures, personnel, patrimoine et pilotage de la commune.</p>
            <Link href="/gestion-communale.html">Entrer dans Gestion CTD <span aria-hidden="true">↗</span></Link>
          </article>

          <article className="omnia-home-card teaching">
            <span className="omnia-home-icon" aria-hidden="true">F</span>
            <small>FELIX · Gestionnaire de cours</small>
            <h2>Enseignement</h2>
            <p>Inscriptions, choix des séries, organisation des cours, publication du calendrier, comptabilité pédagogique et suivi transparent des progrès des apprenants.</p>
            <Link href="/login?next=%2Fworkspace%3Fagent%3Dfelix">Accéder à l’espace FELIX <span aria-hidden="true">↗</span></Link>
          </article>

          <article className="omnia-home-card civil">
            <span className="omnia-home-icon" aria-hidden="true">▤</span>
            <small>MIA · Accompagnement citoyen</small>
            <h2>Demande d’Acte d’état civil</h2>
            <p>Être accompagné pour identifier la démarche, préparer une demande et connaître les points à vérifier auprès de la commune.</p>
            <Link href="/login?next=%2Fworkspace%3Fagent%3Dmia%26intent%3Dcivil">Être accompagné par MIA <span aria-hidden="true">↗</span></Link>
          </article>
        </section>

        <section aria-labelledby="omnia-home-ai-heading">
          <div className="omnia-home-section-heading">
            <div><p>Les intelligences de la plateforme</p><h2 id="omnia-home-ai-heading">Chaque IA a son domaine d’expertise.</h2></div>
          </div>
          <div className="omnia-home-ai-grid">
            <article className="omnia-home-ai omnia"><strong>OMNIA</strong><small>Orientation & orchestration</small><p>Accueille votre demande, identifie le besoin et vous dirige vers l’espace spécialisé approprié.</p></article>
            <article className="omnia-home-ai miora"><strong>MIORA · Gestion CTD</strong><small>Administration communale</small><p>Budgets BP, BA, BR et CA, comptabilité CTD, procédures, ressources humaines, patrimoine et performance.</p></article>
            <article className="omnia-home-ai"><strong>FELIX</strong><small>Gestion pédagogique · Comptabilité</small><p>Organisation des cours, séries et calendriers, suivi pédagogique transparent des apprenants, gestion des abonnements et comptabilité de la plateforme.</p></article>
            <article className="omnia-home-ai mia"><strong>MIA</strong><small>Philosophie, rédaction & état civil</small><p>Problématisation, argumentation, écriture structurée et accompagnement des demandes d’actes civils.</p></article>
          </div>
        </section>

        <footer className="omnia-home-footer">
          Les assistants aident à comprendre, organiser et préparer les démarches. Les actes d’état civil et les documents administratifs ne sont officiels qu’après contrôle et validation par les agents et autorités habilités.
        </footer>
      </div>

      {aboutOpen && (
        <div className="omnia-home-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAboutOpen(false); }}>
          <section className="omnia-home-modal" role="dialog" aria-modal="true" aria-labelledby="omnia-home-modal-title">
            <div className="omnia-home-modal-top">
              <div><p className="omnia-home-eyebrow">SYGEC-IA · OMNIA</p><h2 id="omnia-home-modal-title">Comprendre la plateforme</h2></div>
              <button type="button" className="omnia-home-modal-close" onClick={() => setAboutOpen(false)} aria-label="Fermer la boîte de dialogue">×</button>
            </div>
            <p>SYGEC-IA est un espace numérique qui réunit des outils de gestion des collectivités, d’apprentissage et d’accompagnement des démarches citoyennes. Son objectif est de rendre l’accès aux services plus clair, de guider chaque visiteur vers le bon interlocuteur numérique et de faciliter la préparation du travail.</p>
            <div className="omnia-home-modal-grid">
              <div className="omnia-home-modal-note"><strong>1. Gestion CTD</strong><span>MIORA accompagne les communes dans les opérations budgétaires, comptables et administratives.</span></div>
              <div className="omnia-home-modal-note"><strong>2. Enseignement</strong><span>FELIX gère les inscriptions, les séries, les cours, les calendriers, les paiements de la plateforme et le suivi pédagogique des apprenants.</span></div>
              <div className="omnia-home-modal-note"><strong>3. Demande d’acte civil</strong><span>MIA aide à préciser le besoin et à préparer la demande. L’officier d’état civil habilité reste seul responsable de la délivrance et de la validation de l’acte.</span></div>
              <div className="omnia-home-modal-note"><strong>Le rôle d’OMNIA</strong><span>OMNIA sert de point d’accueil et d’orientation entre les différents espaces spécialisés.</span></div>
            </div>
            <p>Les assistants ne remplacent ni les agents communaux, ni les enseignants, ni les autorités habilitées. Les informations réglementaires et les documents préparés doivent être vérifiés avant toute utilisation officielle.</p>
          </section>
        </div>
      )}
    </main>
  );
}
