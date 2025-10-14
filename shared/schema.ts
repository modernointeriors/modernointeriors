import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, unique, decimal } from "drizzle-orm/pg-core";
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
  slug: text("slug"),
  description: text("description"),
  detailedDescription: text("detailed_description"), // Rich detailed content for project page
  category: varchar("category", { length: 50 }).notNull(), // residential, commercial, architecture
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, archived
  language: varchar("language", { length: 5 }).default("en"), // en, vi
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
  address: text("address"),
  dateOfBirth: timestamp("date_of_birth"), // Ngày tháng năm sinh
  // CRM Pipeline Stage
  stage: varchar("stage", { length: 20 }).notNull().default("lead"), // lead, prospect, contract, delivery, aftercare
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, inactive, archived
  // Customer Tier
  tier: varchar("tier", { length: 20 }).notNull().default("silver"), // vip, silver, gold, platinum
  // Financial tracking
  totalSpending: decimal("total_spending", { precision: 12, scale: 2 }).notNull().default("0"),
  refundAmount: decimal("refund_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  commission: decimal("commission", { precision: 12, scale: 2 }).notNull().default("0"), // Total commission from transactions
  orderCount: integer("order_count").notNull().default(0),
  // Referral Program
  referredById: varchar("referred_by_id").references(() => clients.id),
  referralCount: integer("referral_count").notNull().default(0),
  referralRevenue: decimal("referral_revenue", { precision: 12, scale: 2 }).notNull().default("0"),
  // Warranty & Additional Info
  warrantyStatus: varchar("warranty_status", { length: 30 }).default("none"), // none, active, expired
  warrantyExpiry: timestamp("warranty_expiry"), // Ngày hết hạn bảo hành
  notes: text("notes"),
  tags: jsonb("tags").default([]), // Array of tag strings for flexible categorization
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
  // Process/Journey Section
  journeyTitle: text("journey_title"),
  journeyDescription: text("journey_description"),
  // Advantages Section
  advantagesTitle: text("advantages_title"),
  advantagesSubtitle: text("advantages_subtitle"),
  // FAQ Section Header
  faqSectionTitle: text("faq_section_title"),
  // CTA Section
  ctaTitle: text("cta_title"),
  ctaDescription: text("cta_description"),
  ctaButtonText: text("cta_button_text"),
  ctaSecondaryButtonText: text("cta_secondary_button_text"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  uniqueLanguage: unique().on(table.language),
}));

export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo"), // URL to partner logo
  logoData: text("logo_data"), // Base64 encoded logo file
  website: text("website"), // Optional partner website URL
  description: text("description"), // Optional description
  order: integer("order").notNull().default(0), // For display ordering
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // "project" or "article"
  description: text("description"),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  uniqueSlugType: unique().on(table.slug, table.type),
}));

// CRM: Client Interactions/Activities
export const interactions = pgTable("interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  type: varchar("type", { length: 30 }).notNull(), // visit, meeting, site_survey, design, acceptance, call, email
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // Duration in minutes
  location: text("location"),
  assignedTo: text("assigned_to"), // Staff member name
  outcome: text("outcome"), // Result or notes from interaction
  nextAction: text("next_action"), // Follow-up action required
  nextActionDate: timestamp("next_action_date"),
  attachments: jsonb("attachments").default([]), // Array of file URLs
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// CRM: Deals/Contracts
export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  projectId: varchar("project_id").references(() => projects.id),
  title: text("title").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  stage: varchar("stage", { length: 20 }).notNull().default("proposal"), // proposal, negotiation, contract, delivery, completed, lost
  probability: integer("probability").notNull().default(50), // 0-100%
  expectedCloseDate: timestamp("expected_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  description: text("description"),
  terms: text("terms"), // Contract terms
  notes: text("notes"),
  lostReason: text("lost_reason"), // If deal is lost, why?
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// CRM: Transactions/Orders - Track client payments and orders
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  title: text("title").notNull(), // e.g., "Sake Classic", "Thiết kế nội thất phòng khách"
  description: text("description"), // e.g., "Sake Nguyệt", "Thi công hoàn thiện"
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("payment"), // payment, refund, commission
  status: varchar("status", { length: 20 }).notNull().default("completed"), // pending, completed, cancelled
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const clientsRelations = relations(clients, ({ many, one }) => ({
  inquiries: many(inquiries),
  interactions: many(interactions),
  deals: many(deals),
  transactions: many(transactions),
  referredBy: one(clients, {
    fields: [clients.referredById],
    references: [clients.id],
    relationName: "referrals",
  }),
  referrals: many(clients, {
    relationName: "referrals",
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  client: one(clients, {
    fields: [inquiries.clientId],
    references: [clients.id],
  }),
}));

export const interactionsRelations = relations(interactions, ({ one }) => ({
  client: one(clients, {
    fields: [interactions.clientId],
    references: [clients.id],
  }),
  createdBy: one(users, {
    fields: [interactions.createdBy],
    references: [users.id],
  }),
}));

export const dealsRelations = relations(deals, ({ one }) => ({
  client: one(clients, {
    fields: [deals.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [deals.projectId],
    references: [projects.id],
  }),
  assignedTo: one(users, {
    fields: [deals.assignedTo],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [deals.createdBy],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  client: one(clients, {
    fields: [transactions.clientId],
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
}).extend({
  dateOfBirth: z.union([z.string(), z.date()]).optional().transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
  warrantyExpiry: z.union([z.string(), z.date()]).optional().transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
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

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  paymentDate: z.union([
    z.string().transform((str) => new Date(str)),
    z.date()
  ])
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

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type Interaction = typeof interactions.$inferSelect;

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Settings/Branding table
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  logoUrl: text("logo_url"),
  logoData: text("logo_data"), // Base64 encoded image data
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  zaloUrl: text("zalo_url"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

// FAQs table
export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  page: varchar("page", { length: 20 }).notNull(), // "home", "contact"
  language: varchar("language", { length: 5 }).notNull().default("en"), // en, vi
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

// Advantages table (Why Choose Us section)
export const advantages = pgTable("advantages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  icon: text("icon").notNull(), // Lucide icon name (e.g., "Sparkles", "Headset")
  titleEn: text("title_en").notNull(),
  titleVi: text("title_vi").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionVi: text("description_vi").notNull(),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAdvantageSchema = createInsertSchema(advantages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdvantage = z.infer<typeof insertAdvantageSchema>;
export type Advantage = typeof advantages.$inferSelect;

// Design Journey Steps table (5-step process section)
export const journeySteps = pgTable("journey_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stepNumber: integer("step_number").notNull(), // 1, 2, 3, 4, 5
  titleEn: text("title_en").notNull(),
  titleVi: text("title_vi").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionVi: text("description_vi").notNull(),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertJourneyStepSchema = createInsertSchema(journeySteps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJourneyStep = z.infer<typeof insertJourneyStepSchema>;
export type JourneyStep = typeof journeySteps.$inferSelect;
