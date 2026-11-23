# Intégration de MIA dans SYGEC-IA

Date de l'intégration : 23 novembre 2026.
Source : `philocours-ia/MIA`, branche `main`, commit source `203e3e7b95d8b2b35590bb8e824de773ed4b6b9e`.

## Conservation du projet source

Le dépôt MIA et son projet Vercel d'origine ne sont pas supprimés ni modifiés. Le code de l'application, les composants spécialisés, les instructions d'expertise, les schémas, les migrations et les documents de migration sont intégrés au dépôt SYGEC-IA.

## Backend conservé

L'application SYGEC-IA est raccordée au projet Supabase MIA existant (PostgreSQL 17). Les tables de la bibliothèque documentaire y contenaient 12 sources et 24 extraits indexés. Les 12 sources listées dans le README gardent leurs statuts de vérification et leurs réserves.

Les comptes, profils et politiques RLS restent dans ce projet Supabase. Aucun document privé, profil personnel ou secret n'est exporté dans Git. Le backend MIA existant est préféré à l'ancienne base Gestion-Communale : cette dernière a un avertissement de sécurité portant sur une fonction SECURITY DEFINER accessible par les rôles anon et authenticated.

## Éléments d'interface et de code intégrés

- Application App Router Next.js, authentification Supabase, proxy de session, espace de travail.
- OMNIA comme intelligence de coordination.
- MIORA CTD et MIORA Maths.
- MIA philosophie et rédaction.
- Instructions d'expertise, bibliothèque documentaire et API de conversation.
- Espace métier MIORA et ses groupes de formulaires.
- Schéma de base, migrations, types TypeScript et documents d'inventaire.
- Ancienne interface communale HTML conservée à `/gestion-communale.html`.

## Ce qui n'est pas présenté comme terminé

La migration n'élargit pas artificiellement la portée fonctionnelle des fondations existantes. Les calculs normatifs complets, les nomenclatures contrôlées, les maquettes ministérielles d'impression, les 1 695 fiches communales validées, la synchronisation serveur des brouillons MIORA, les modules de paiement et l'interface opérationnelle de l'état civil restent à compléter et tester.

Les brouillons MIORA restent locaux au navigateur. L'application les étiquette comme brouillons et recommande de n'utiliser que des données fictives. Le module d'état civil prépare des documents de travail ; toute validation légale demeure humaine.

## Actions de configuration restant hors Git

1. Définir dans Supabase Auth le Site URL `https://sygec-ia.vercel.app` et autoriser `https://sygec-ia.vercel.app/auth/callback`.
2. Configurer dans Vercel un secret `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY` pour activer le moteur de conversation. Aucun secret n'est ajouté au dépôt.
3. Vérifier les flux d'inscription/connexion, l'accès bibliothèque, le routage agent et la fonction `/api/health` après déploiement.
