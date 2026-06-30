import {
  pgTable,
  text,
  uuid,
  boolean,
  integer,
  real,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

// super_admin: the first-run account; full control incl. user management.
// admin: optional middle role with user-management rights.
// user: a normal learner; never sees admin controls.
export const roleEnum = pgEnum("role", ["super_admin", "admin", "user"]);

// inactive accounts cannot sign in but are retained (deactivate/reactivate).
export const userStatusEnum = pgEnum("user_status", ["active", "inactive"]);

// Supported bring-your-own-key AI providers. Adding a provider = one new value
// here plus one adapter; no feature code changes (see lib/ai).
export const aiProviderEnum = pgEnum("ai_provider", [
  "anthropic",
  "openai",
  "xai",
  "google",
]);

// ---------------------------------------------------------------------------
// Users & profile
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    // Argon2id hash. Never stored in plaintext; never logged.
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: roleEnum("role").notNull().default("user"),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);

// One profile per user: chosen track/branch, optional personalized welcome
// text (the ONLY place a personal welcome may live — never in source, §1/§12),
// and free-form preferences.
export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  // Slugs reference the committed curriculum data files, not DB rows.
  trackId: text("track_id"),
  branchId: text("branch_id"),
  welcomeText: text("welcome_text"),
  preferences: jsonb("preferences").$type<Record<string, unknown>>(),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Per-topic user data (curriculum itself lives in committed data files;
// every row here is keyed by a stable topic slug + scoped to one user).
// ---------------------------------------------------------------------------

// User-added learning links. Seeded as nothing — the app ships ZERO URLs (§3.2).
export const resourceLinks = pgTable(
  "resource_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicSlug: text("topic_slug").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    note: text("note"),
    watched: boolean("watched").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("resource_links_user_topic_idx").on(t.userId, t.topicSlug)],
);

// Per user, per topic: manual completion flag + practice-derived stats.
export const progress = pgTable(
  "progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicSlug: text("topic_slug").notNull(),
    completed: boolean("completed").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    bestScore: real("best_score"),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
    // 0..1 honest mastery estimate derived from recent scores (§8.4).
    masteryEstimate: real("mastery_estimate"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("progress_user_topic_unique").on(t.userId, t.topicSlug)],
);

// Every generated task + its hidden key + the submission + grade. Powers the
// mistake-review log and the readiness score (§7, §8.3).
export const assessmentAttempts = pgTable(
  "assessment_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicSlug: text("topic_slug").notNull(),
    taskType: text("task_type").notNull(),
    difficulty: integer("difficulty").notNull().default(1),
    // The generated task as shown to the user (scenario, inputs, prompt).
    task: jsonb("task").$type<Record<string, unknown>>().notNull(),
    // Hidden worked solution / rubric — revealed only after submission (§8.3).
    answerKey: jsonb("answer_key").$type<Record<string, unknown>>().notNull(),
    submission: jsonb("submission").$type<Record<string, unknown>>(),
    score: real("score"),
    feedback: jsonb("feedback").$type<Record<string, unknown>>(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("attempts_user_topic_idx").on(t.userId, t.topicSlug)],
);

// AI provider choice per user. By default the API key is NOT stored here —
// it is forwarded per-request from the browser (§6). encryptedKey is only set
// when the user explicitly opts into encrypted-at-rest storage.
export const aiSettings = pgTable("ai_settings", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: aiProviderEnum("provider"),
  model: text("model"),
  // Opt-in only. AES-GCM ciphertext (never plaintext, never logged).
  encryptedKey: text("encrypted_key"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type ResourceLink = typeof resourceLinks.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type AssessmentAttempt = typeof assessmentAttempts.$inferSelect;
export type AiSettings = typeof aiSettings.$inferSelect;
