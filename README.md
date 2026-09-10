# Formation IA

Plateforme interne de formation IA : les participants suivent des modules
théoriques/pratiques dans un ordre imposé (un module se débloque quand le
précédent est terminé), avec connexion par e-mail whitelisté (aucun mot de
passe : si l'adresse a été ajoutée par un admin, la connexion est immédiate),
profil (équipe / niveau) et suivi admin. Disponible en français et en anglais.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript) déployé sur [Vercel](https://vercel.com)
- [Vercel Postgres (Neon)](https://vercel.com/marketplace/neon) + [Drizzle ORM](https://orm.drizzle.team)
- [next-intl](https://next-intl.dev) pour le FR/EN (routes préfixées `/fr`, `/en`)
- Session : cookie httpOnly signé (JWT via `jose`), pas de mot de passe

## Démarrage local

```bash
npm install
npx vercel env pull .env.local   # récupère DATABASE_URL depuis Vercel
npm run db:push                  # applique le schéma sur la base
npm run db:seed                  # modules + premier compte admin
npm run dev
```

Variables d'environnement : voir [.env.local.example](.env.local.example).

## Accès et sécurité

Il n'y a pas de mot de passe : un administrateur ajoute une adresse e-mail
dans `/admin/emails` (avec un rôle `participant` ou `admin`), et toute
personne qui saisit cette adresse sur `/login` est connectée directement.
La sécurité de la plateforme repose donc entièrement sur la maîtrise de la
liste des adresses autorisées — ne whitelister que des adresses de
confiance.

## Modèle

- `allowed_emails` — whitelist des adresses autorisées à se connecter, gérée depuis `/admin/emails`
- `users` — profil (nom, équipe, niveau), rôle `admin` ou `participant`
- `modules` — contenu des deux journées de formation (voir `src/lib/db/seed.ts`)
- `module_progress` — modules marqués comme terminés par chaque participant

La progression (verrouillé / disponible / terminé) est calculée à la volée
dans [`src/lib/modules/progress.ts`](src/lib/modules/progress.ts) — aucun état
"locked" n'est stocké en base.

## Langues

Les traductions vivent dans [`messages/fr.json`](messages/fr.json) et
[`messages/en.json`](messages/en.json) (mêmes clés dans les deux fichiers).
Ajouter une langue : créer `messages/<code>.json`, l'ajouter à `locales` dans
[`src/i18n/routing.ts`](src/i18n/routing.ts). Le contenu des modules
(titres/descriptions en base, importé depuis l'Excel) n'est lui saisi qu'en
français pour l'instant.

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run db:push` | Applique `src/lib/db/schema.ts` sur la base |
| `npm run db:studio` | Interface Drizzle Studio pour inspecter la base |
| `npm run db:seed` | Charge les modules + whitelist le premier compte admin |

## Déploiement

Le projet est lié au projet Vercel `dbs-ai/formation-ia`. Un push sur `main`
déclenche un déploiement automatique une fois le repo GitHub connecté dans
les paramètres du projet Vercel (Git → Connect).

## Charte graphique

- Texte : noir ou blanc uniquement.
- `#FF3C47` est l'unique accent (barres, badges, liens actifs) — jamais utilisé pour du texte courant.
- Pas de vert/orange/bleu de statut : les états restent dans la palette rouge / taupe / encre.
- Design flat : coins droits partout, sauf inputs/boutons (rayon léger) et pills (arrondi complet).
