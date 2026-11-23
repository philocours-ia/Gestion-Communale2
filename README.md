# SYGEC-IA • OMNIA

SYGEC-IA est l’écosystème réunissant OMNIA et ses intelligences spécialisées. OMNIA coordonne les expertises de gestion communale, d’enseignement, de recherche documentaire et de rédaction.

## Intelligences spécialisées intégrées

- **MIORA — Gestion communale et CTD** : BP, BA, BR, CA, exécution, gouvernance, ressources humaines, patrimoine et performance.
- **MIORA Maths — Enseignement** : raisonnement, calculs, démonstrations et exercices guidés.
- **MIA — Philosophie et rédaction** : problématisation, concepts, argumentation, explication de textes, dissertation et rédaction administrative.
- **OMNIA — Coordination** : orientation de la demande vers l’expertise pertinente et continuité entre les espaces.

Le code des agents et de leurs instructions est conservé dans `lib/agents/expertise-modules.ts`. L’espace de travail MIORA est dans `components/miora/miora-workspace.tsx`; l’interface de MIA et l’orchestration sont dans `app/workspace/workspace-client.tsx`.

## Données et bibliothèque MIA

Le projet réutilise le projet Supabase MIA déjà existant, plutôt que de recopier son corpus dans l’ancienne base Gestion-Communale. Au moment de l’intégration, la bibliothèque partagée contenait **12 sources et 24 extraits indexés**. Les sources restent dans Supabase, avec leurs références, articles/pages, catégories, niveaux de vérification et réserves d’applicabilité. Les 12 références sont :

1. Arrêté PCOP CTD n°20.765/2007/MFB/CSC/07.
2. Décret n°2015-959 relatif à la gestion budgétaire et financière des CTD.
3. Décret n°2018-162 relatif aux avantages et indemnités des responsables communaux.
4. Décret n°2018-427 modificatif.
5. Loi n°2018-027 relative à l’état civil.
6. Loi n°2026-001 sur l’enregistrement dérogatoire des naissances pendant l’enrôlement biométrique de masse.
7. Loi organique n°2014-018 relative aux CTD.
8. Manuel de procédures administratives à l’usage des Communes.
9. Manuel de procédures budgétaires CR1, Communes urbaines et Régions.
10. Manuel de procédures budgétaires CR2.
11. Manuel de procédures comptables CR2.
12. Annonce relative au Manuel national de l’état civil (version et diffusion à confirmer).

Les statuts `historical_reference`, `amended`, `scope_limited` et `needs_review` sont conservés : une référence ne doit pas être présentée comme applicable à toutes les communes ni comme texte en vigueur sans vérification. Le corpus n’est pas une copie intégrale des PDF : il contient des métadonnées et des extraits documentaires référencés.

Le projet Supabase MIA est conservé et utilisé comme backend de l’application intégrée. Son schéma et ses politiques RLS sont documentés dans `supabase/`. La base Gestion-Communale préexistante n’est pas utilisée comme backend de cette intégration.

## Interface communale historique

L’interface HTML existante a été conservée dans `public/gestion-communale.html` et reste accessible à `/gestion-communale.html`. Elle ne synchronise pas automatiquement ses données locales avec les brouillons MIORA ni avec Supabase.

## Limites importantes conservées de la source MIA

- Les formulaires métier MIORA forment un espace de préparation et de brouillons locaux ; ils ne constituent pas encore un moteur comptable réglementaire complet.
- Les brouillons MIORA sont actuellement stockés dans le navigateur par utilisateur ; ils ne sont ni chiffrés ni synchronisés. N’y saisir aucune donnée personnelle réelle, donnée de paie ou dossier confidentiel.
- Les modèles et actes d’état civil générés restent des projets soumis à vérification et validation humaines. L’IA ne signe pas, n’authentifie pas et n’attribue pas de numéro officiel.
- Les sources juridiques doivent être relues dans leur version intégrale et à la lumière des textes modificatifs et du classement exact de la CTD.
- Le module Académie affiche les disciplines et parcours T12 prévus ; seules les expertises signalées comme intégrées sont à considérer comme disponibles.
- Les dossiers personnels, les données de profil et les identifiants secrets ne sont pas copiés dans le dépôt Git.

## Configuration Vercel

Variables publiques nécessaires :
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Moteur IA côté serveur :
- `MIA_PROVIDER`
- `MIA_MODEL`
- `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY`

Les clés fournisseur restent des secrets Vercel côté serveur et ne doivent jamais être ajoutées au dépôt. Tant qu’aucune clé de fournisseur n’est configurée, le statut de l’IA demeure en attente et les conversations ne peuvent pas produire de réponse.

Le domaine `https://sygec-ia.vercel.app` doit être ajouté dans Supabase Auth comme Site URL et URL de redirection autorisée vers `/auth/callback`.

## Références de migration

Les inventaires complets et les limites connues de la migration MIORA sont conservés dans `docs/MIA/`. Le code source de l’application MIA d’origine reste également dans son dépôt séparé : `https://github.com/philocours-ia/MIA`.
