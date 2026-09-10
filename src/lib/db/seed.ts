import "dotenv/config";
import { db } from "./index";
import { allowedEmails, modules } from "./schema";

// Ordre exact des lignes du fichier Programme_Formation_IA.xlsx (feuille "J1").
// L'ID Excel est conservé dans le titre entre parenthèses à titre de référence
// interne uniquement quand il existe ; la position d'affichage suit l'ordre
// réel des lignes de la feuille (qui diffère parfois de l'ID numérique).
const day1 = [
  {
    type: "prerequis" as const,
    title: "Avant la formation",
    description:
      "Licence Claude Code / Claude Code installé et fonctionnel\nBeMind installé et fonctionnel\nGit installé et fonctionnel\nCompte GitHub créé et connecté à Claude Code",
  },
  {
    type: "theorique" as const,
    title: "Introduction",
    description:
      "But de la formation\nPlan des deux journées\nOutils utilisés\nFramework BearingPoint\nPrésentation des supports (dashboard de suivi des points…)",
  },
  {
    type: "theorique" as const,
    title: "Installation & environnements",
    description: "Vérifications techniques avec tous les participants",
  },
  {
    type: "theorique" as const,
    title: "Présentation du terminal : Bash…",
    description: "Commandes de base",
  },
  {
    type: "theorique" as const,
    title: "Présentation de Git (créer un dépôt…)",
    description: "Fonctionnement général",
  },
  {
    type: "theorique" as const,
    title: "Présentation de GitHub",
    description: "Clone, branche, commit…",
  },
  {
    type: "pratique" as const,
    title: "Jeu Terminal / GitHub",
    description: "Ajout d'un fichier dans un repo\nTest des étapes Git classiques",
  },
  {
    type: "theorique" as const,
    title: "Claude Code vs BeMind",
    description:
      "Présentation des deux outils\nComparatif entre les deux\nCommandes Claude Code",
  },
  {
    type: "theorique" as const,
    title: "État d'esprit IA",
    description: "Bien prompter",
  },
  {
    type: "theorique" as const,
    title: "Présentation des différents modèles Claude",
    description: "Commandes principales Claude Code",
  },
  {
    type: "pratique" as const,
    title: "Test des différents modèles Claude",
    description: "Trouver un cas d'usage pour chaque modèle",
  },
  {
    type: "pratique" as const,
    title: "Test BeMind",
    description: "Réutiliser les cas d'usage précédents et comparer",
  },
  {
    type: "pause" as const,
    title: "Pause déjeuner",
    description: null,
  },
  {
    type: "theorique" as const,
    title: "Présentation des agents",
    description: "Qu'est-ce qu'un agent ?\nComment en créer un ?",
  },
  {
    type: "theorique" as const,
    title: "Présentation des connecteurs Claude",
    description: "Outlook\nReference Radar\nSharePoint\n…",
  },
  {
    type: "pratique" as const,
    title: "Use case 1",
    description: "Créer un compte-rendu à partir d'un transcript, puis l'envoyer par e-mail",
  },
  {
    type: "pratique" as const,
    title: "Use case 2",
    description: "Préparation d'un pitch d'offre PowerPoint",
  },
  {
    type: "theorique" as const,
    title: "Partager ses agents",
    description: "Collaborer pour améliorer un agent",
  },
  {
    type: "pratique" as const,
    title: "Test du partage d'un agent",
    description: "Partager l'agent du module précédent",
  },
  {
    type: "theorique" as const,
    title: "Bien gérer ses tokens",
    description:
      "Consommation des différents modèles\nComment visualiser sa consommation\nToken lecture, écriture et cache",
  },
  {
    type: "theorique" as const,
    title: "Gérer la mémoire",
    description: "Où est stockée la mémoire ?\nCycle de vie\nFonctionnement des sessions",
  },
  {
    type: "theorique" as const,
    title: "Créer ses routines",
    description: "Exemple de routine",
  },
];

const day2 = [
  { type: "theorique" as const, title: "Intro", description: null },
  {
    type: "theorique" as const,
    title: "Choix des sujets",
    description: "Agents\nDashboard\n…",
  },
  ...Array.from({ length: 18 }, (_, i) => ({
    type: "theorique" as const,
    title: `Module à définir ${i + 3}`,
    description: "Contenu en cours de préparation.",
  })),
];

async function seed() {
  console.log("Seeding modules…");
  await db.delete(modules);

  await db.insert(modules).values(
    day1.map((m, i) => ({
      day: 1,
      position: i + 1,
      title: m.title,
      type: m.type,
      description: m.description,
    }))
  );

  await db.insert(modules).values(
    day2.map((m, i) => ({
      day: 2,
      position: i + 1,
      title: m.title,
      type: m.type,
      description: m.description,
    }))
  );

  const adminEmail = "adrien.dub2000@gmail.com";
  console.log(`Whitelisting admin: ${adminEmail}`);
  await db
    .insert(allowedEmails)
    .values({ email: adminEmail, role: "admin", addedBy: "seed" })
    .onConflictDoUpdate({
      target: allowedEmails.email,
      set: { role: "admin" },
    });

  console.log("Seed terminé.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
