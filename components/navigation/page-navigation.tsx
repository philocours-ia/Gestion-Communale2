"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type PageNavigationProps = {
  compact?: boolean;
  className?: string;
};

export default function PageNavigation({ compact = false, className = "" }: PageNavigationProps) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  return (
    <nav
      className={["page-navigation", compact ? "page-navigation--compact" : "", className].filter(Boolean).join(" ")}
      aria-label="Navigation de la page"
    >
      <button
        type="button"
        className="page-nav-button page-nav-back"
        onClick={goBack}
        aria-label="Revenir à la page précédente"
        title="Page précédente"
      >
        <span aria-hidden="true">←</span>
        <span className="page-nav-label">Précédente</span>
      </button>
      <Link
        href="/"
        className="page-nav-button page-nav-home"
        aria-label="Revenir à la page d’accueil"
        title="Accueil"
      >
        <span aria-hidden="true">⌂</span>
        <span className="page-nav-label">Accueil</span>
      </Link>
    </nav>
  );
}
