import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  detailedDescription: text("detailed_description"), // Rich detailed content for project page
  category: varchar("category", { length: 50 }).notNull(), // residential, commercial, architecture
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, archived
  location: text("location"),
  area: text("area"),
  duration: text("duration"),
  budget: text("budget"),
  style: text("style"),
  designer: text("designer"), // Interior Designer name
  completionYear: text("completion_year"), // Year completed
  // Image categories with specific constraints
  coverImages: jsonb("cover_images").default([]), // Max 2 images, 3:4 aspect ratio
  contentImages: jsonb("content_images").default([]), // 2 images, 16:9 or 1:1 aspect ratio  
  galleryImages: jsonb("gallery_images").default([]), // Max 10 images, 16:9 or 1:1 aspect ratio
  featured: boolean("featured").notNull().default(false),
  // Legacy fields for backward compatibility
  heroImage: text("hero_image"), // Legacy: Main project hero image
  images: jsonb("images").default([]), // Legacy field, keeping for compatibility
  relatedProjects: jsonb("related_projects").default([]), // Array of related project IDs
  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  status: varchar("status", { length: 20 }).notNull().default("lead"), // lead, active, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: varchar("project_type", { length: 50 }).notNull(),
  budget: varchar("budget", { length: 50 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new, reviewed, contacted, converted
  clientId: varchar("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  features: jsonb("features").default([]), // array of service features
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: varchar("category", { length: 50 }).notNull().default("general"), // news, tips, projects, design-trends
  tags: jsonb("tags").default([]), // array of tag strings
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, published, archived
  language: varchar("language", { length: 5 }).notNull().default("en"), // en, vi
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at"),
  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  // Analytics
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  uniqueSlugLanguage: unique().on(table.slug, table.language),
}));

export const homepageContent = pgTable("homepage_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  language: varchar("language", { length: 5 }).notNull().default("en"), // en, vi
  // Hero Section
  heroBackgroundImage: text("hero_background_image"),
  heroTitle: text("hero_title").notNull().default("Moderno Interiors"),
  heroStudio: text("hero_studio").notNull().default("Design"),
  heroTagline: text("hero_tagline"),
  heroArchitectureLabel: text("hero_architecture_label"),
  heroInteriorLabel: text("hero_interior_label"),
  heroConsultationText: text("hero_consultation_text"),
  // Featured Section
  featuredBadge: text("featured_badge"),
  featuredTitle: text("featured_title"),
  featuredDescription: text("featured_description"),
  // Stats Section
  statsProjectsLabel: text("stats_projects_label"),
  statsClientsLabel: text("stats_clients_label"),
  statsAwardsLabel: text("stats_awards_label"),
  statsExperienceLabel: text("stats_experience_label"),
  // CTA Section
  ctaTitle: text("cta_title"),
  ctaDescription: text("cta_description"),
  ctaButtonText: text("cta_button_text"),
  ctaSecondaryButtonText: text("cta_secondary_button_text"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  uniqueLanguage: unique().on(table.language),
}));

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  inquiries: many(inquiries),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  client: one(clients, {
    fields: [inquiries.clientId],
    references: [clients.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertHomepageContentSchema = createInsertSchema(homepageContent).omit({
  id: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertHomepageContent = z.infer<typeof insertHomepageContentSchema>;
export type HomepageContent = typeof homepageContent.$inferSelect;
