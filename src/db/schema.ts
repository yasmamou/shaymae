import {
  pgTable, text, integer, real, boolean, timestamp, jsonb, uuid, index,
} from "drizzle-orm/pg-core";
import type {
  Service, MediaItem, Story, Review, BookingMode, CategoryKey,
} from "@/lib/data";

// ── Catalogue : créatrices (référence, seedée depuis les données mock) ──
export const creators = pgTable("creators", {
  slug: text("slug").primaryKey(),
  ownerUserId: uuid("owner_user_id"),
  name: text("name").notNull(),
  handle: text("handle").notNull(),
  tagline: text("tagline").notNull(),
  categories: jsonb("categories").$type<CategoryKey[]>().notNull(),
  rating: real("rating").notNull(),
  reviews: integer("reviews").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  mode: text("mode").notNull(),
  address: text("address"),
  zones: jsonb("zones").$type<string[]>(),
  radiusKm: integer("radius_km"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  bio: text("bio").notNull(),
  avatarSeed: integer("avatar_seed").notNull(),
  coverSeed: integer("cover_seed").notNull(),
  verified: boolean("verified").default(false),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  booking: jsonb("booking").$type<BookingMode[]>().notNull(),
  services: jsonb("services").$type<Service[]>().notNull(),
  gallery: jsonb("gallery").$type<MediaItem[]>().notNull(),
  stories: jsonb("stories").$type<Story[]>().notNull(),
  reviewsList: jsonb("reviews_list").$type<Review[]>().notNull(),
});

export const formations = pgTable("formations", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  trainer: text("trainer").notNull(),
  base: text("base").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  durationDays: integer("duration_days").notNull(),
  price: integer("price").notNull(),
  rating: real("rating").notNull(),
  reviews: integer("reviews").notNull(),
  level: text("level").notNull(),
  certified: boolean("certified").default(false),
  seed: integer("seed").notNull(),
  program: jsonb("program").$type<string[]>().notNull(),
});

// ── Comptes & sessions ──
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("cliente"), // cliente | creatrice
  city: text("city"),
  handle: text("handle"),
  categories: jsonb("categories").$type<CategoryKey[]>(),
  mode: text("mode"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Données utilisateur ──
export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  creatorSlug: text("creator_slug").notNull(),
  creatorName: text("creator_name").notNull(),
  serviceName: text("service_name").notNull(),
  price: integer("price").notNull(),
  deposit: integer("deposit").notNull(),
  date: text("date").notNull(),
  slot: text("slot").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  phone: text("phone"),
  status: text("status").notNull().default("confirmé"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index("res_user_idx").on(t.userId)]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  creatorSlug: text("creator_slug").notNull(),
  fromMe: boolean("from_me").notNull(),
  text: text("text").notNull().default(""),
  kind: text("kind").notNull().default("text"),
  seed: integer("seed"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index("msg_thread_idx").on(t.userId, t.creatorSlug)]);

export const follows = pgTable("follows", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  creatorSlug: text("creator_slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index("follow_user_idx").on(t.userId)]);

export const favorites = pgTable("favorites", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  itemId: text("item_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [index("fav_user_idx").on(t.userId)]);

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  label: text("label").notNull(),
  caption: text("caption").default(""),
  seed: integer("seed").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type DbUser = typeof users.$inferSelect;
export type DbReservation = typeof reservations.$inferSelect;
