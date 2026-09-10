import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "participant"]);
export const levelEnum = pgEnum("level", [
  "novice",
  "debutant",
  "intermediaire",
  "expert",
]);
export const moduleTypeEnum = pgEnum("module_type", [
  "prerequis",
  "theorique",
  "pratique",
  "pause",
]);

export const allowedEmails = pgTable(
  "allowed_emails",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    role: roleEnum("role").notNull().default("participant"),
    addedBy: varchar("added_by", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("allowed_emails_email_idx").on(table.email)]
);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    role: roleEnum("role").notNull().default("participant"),
    name: varchar("name", { length: 255 }),
    team: varchar("team", { length: 255 }),
    level: levelEnum("level"),
    onboardingComplete: boolean("onboarding_complete").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  day: integer("day").notNull(),
  position: integer("position").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  type: moduleTypeEnum("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const moduleProgress = pgTable(
  "module_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: integer("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("module_progress_user_module_idx").on(
      table.userId,
      table.moduleId
    ),
  ]
);
