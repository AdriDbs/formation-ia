import "dotenv/config";
import { randomBytes } from "crypto";
import { db } from "./index";
import { modules, adminAccount } from "./schema";
import { hashPassword } from "../auth/password";

// Ordre exact des lignes du fichier Programme_Formation_IA.xlsx (feuille "J1").
// La position d'affichage suit l'ordre réel des lignes de la feuille (qui
// diffère parfois de l'ID numérique de la colonne "ID" du fichier source).
// `category` regroupe les modules en unités thématiques pour l'affichage
// (inspiré des "units" façon Codecademy) — ce n'est pas dans le fichier
// source, c'est un regroupement éditorial pour la nav / le design. Le
// contenu du Jour 2 n'étant pas encore défini, il n'apparaît pas ici : le
// programme n'est plus scindé en journées, c'est un parcours unique.
const programme = [
  {
    category: "onboarding",
    type: "prerequis" as const,
    title: "Avant la formation",
    description:
      "Licence Claude Code / Claude Code installé et fonctionnel\nBeMind installé et fonctionnel\nGit installé et fonctionnel\nCompte GitHub créé et connecté à Claude Code",
  },
  {
    category: "onboarding",
    type: "theorique" as const,
    title: "Introduction",
    description:
      "But de la formation\nPlan des deux journées\nOutils utilisés\nFramework BearingPoint\nPrésentation des supports (dashboard de suivi des points…)",
  },
  {
    category: "onboarding",
    type: "theorique" as const,
    title: "Installation & environnements",
    description: "Vérifications techniques avec tous les participants",
  },
  {
    category: "onboarding",
    type: "theorique" as const,
    title: "Présentation du terminal : Bash…",
    description: "Commandes de base",
  },
  {
    category: "onboarding",
    type: "theorique" as const,
    title: "Présentation de Git (créer un dépôt…)",
    description: "Fonctionnement général",
  },
  {
    category: "onboarding",
    type: "theorique" as const,
    title: "Présentation de GitHub",
    description: "Clone, branche, commit…",
  },
  {
    category: "onboarding",
    type: "pratique" as const,
    title: "Jeu Terminal / GitHub",
    description: "Ajout d'un fichier dans un repo\nTest des étapes Git classiques",
  },
  {
    category: "claude-code",
    type: "theorique" as const,
    title: "Claude Code vs BeMind",
    description:
      "Présentation des deux outils\nComparatif entre les deux\nCommandes Claude Code",
  },
  {
    category: "claude-code",
    type: "theorique" as const,
    title: "État d'esprit IA",
    description: "Bien prompter",
  },
  {
    category: "claude-code",
    type: "theorique" as const,
    title: "Présentation des différents modèles Claude",
    description: "Commandes principales Claude Code",
  },
  {
    category: "claude-code",
    type: "pratique" as const,
    title: "Test des différents modèles Claude",
    description: "Trouver un cas d'usage pour chaque modèle",
  },
  {
    category: "claude-code",
    type: "pratique" as const,
    title: "Test BeMind",
    description: "Réutiliser les cas d'usage précédents et comparer",
  },
  {
    category: "claude-code",
    type: "pause" as const,
    title: "Pause déjeuner",
    description: null,
  },
  {
    category: "agents",
    type: "theorique" as const,
    title: "Présentation des agents",
    description: "Qu'est-ce qu'un agent ?\nComment en créer un ?",
  },
  {
    category: "agents",
    type: "theorique" as const,
    title: "Présentation des connecteurs Claude",
    description: "Outlook\nReference Radar\nSharePoint\n…",
  },
  {
    category: "agents",
    type: "pratique" as const,
    title: "Use case 1",
    description: "Créer un compte-rendu à partir d'un transcript, puis l'envoyer par e-mail",
  },
  {
    category: "agents",
    type: "pratique" as const,
    title: "Use case 2",
    description: "Préparation d'un pitch d'offre PowerPoint",
  },
  {
    category: "agents",
    type: "theorique" as const,
    title: "Partager ses agents",
    description: "Collaborer pour améliorer un agent",
  },
  {
    category: "agents",
    type: "pratique" as const,
    title: "Test du partage d'un agent",
    description: "Partager l'agent du module précédent",
  },
  {
    category: "mastery",
    type: "theorique" as const,
    title: "Bien gérer ses tokens",
    description:
      "Consommation des différents modèles\nComment visualiser sa consommation\nToken lecture, écriture et cache",
  },
  {
    category: "mastery",
    type: "theorique" as const,
    title: "Gérer la mémoire",
    description: "Où est stockée la mémoire ?\nCycle de vie\nFonctionnement des sessions",
  },
  {
    category: "mastery",
    type: "theorique" as const,
    title: "Créer ses routines",
    description: "Exemple de routine",
  },
];

async function seed() {
  console.log("Seeding modules…");
  await db.delete(modules);

  await db.insert(modules).values(
    programme.map((m, i) => ({
      position: i + 1,
      category: m.category,
      title: m.title,
      type: m.type,
      description: m.description,
    }))
  );

  const [existingAdmin] = await db.select().from(adminAccount).limit(1);

  if (!existingAdmin) {
    const tempPassword = randomBytes(9).toString("base64url");
    const passwordHash = await hashPassword(tempPassword);
    await db.insert(adminAccount).values({ passwordHash });
    console.log("Accès admin créé.");
    console.log(`Mot de passe temporaire : ${tempPassword}`);
    console.log("→ à changer depuis /admin/settings après la première connexion.");
  } else {
    console.log("Accès admin déjà configuré (mot de passe conservé).");
  }

  console.log("Seed terminé.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
