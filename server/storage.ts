import { 
  users, clients, projects, inquiries, services, articles, homepageContent,
  type User, type InsertUser,
  type Client, type InsertClient,
  type Project, type InsertProject,
  type Inquiry, type InsertInquiry,
  type Service, type InsertService,
  type Article, type InsertArticle,
  type HomepageContent, type InsertHomepageContent
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjects(filters?: { category?: string; featured?: boolean }): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Clients
  getClients(status?: string): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client>;

  // Inquiries
  getInquiries(status?: string): Promise<Inquiry[]>;
  getInquiry(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Articles/Blog
  getArticles(filters?: { 
    category?: string; 
    featured?: boolean; 
    status?: string; 
    language?: string;
    tags?: string[];
  }): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string, language?: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  incrementArticleViews(id: string): Promise<void>;

  // Homepage Content
  getHomepageContent(language?: string): Promise<HomepageContent | undefined>;
  upsertHomepageContent(content: InsertHomepageContent): Promise<HomepageContent>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Projects
  async getProjects(filters?: { category?: string; featured?: boolean }): Promise<Project[]> {
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(projects.category, filters.category));
    }
    
    if (filters?.featured !== undefined) {
      conditions.push(eq(projects.featured, filters.featured));
    }
    
    const query = conditions.length > 0
      ? db.select().from(projects).where(and(...conditions))
      : db.select().from(projects);
    
    return await query.orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Clients
  async getClients(status?: string): Promise<Client[]> {
    const query = status
      ? db.select().from(clients).where(eq(clients.status, status))
      : db.select().from(clients);
    
    return await query.orderBy(desc(clients.createdAt));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: string, client: Partial<InsertClient>): Promise<Client> {
    const [updatedClient] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  // Inquiries
  async getInquiries(status?: string): Promise<Inquiry[]> {
    const query = status
      ? db.select().from(inquiries).where(eq(inquiries.status, status))
      : db.select().from(inquiries);
    
    return await query.orderBy(desc(inquiries.createdAt));
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry || undefined;
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async updateInquiry(id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set(inquiry)
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.order);
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Articles/Blog
  async getArticles(filters?: { 
    category?: string; 
    featured?: boolean; 
    status?: string; 
    language?: string;
    tags?: string[];
  }): Promise<Article[]> {
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(articles.category, filters.category));
    }
    
    if (filters?.featured !== undefined) {
      conditions.push(eq(articles.featured, filters.featured));
    }
    
    if (filters?.status) {
      conditions.push(eq(articles.status, filters.status));
    }
    
    if (filters?.language) {
      conditions.push(eq(articles.language, filters.language));
    }
    
    // For public queries, only show published articles
    if (!filters?.status) {
      conditions.push(eq(articles.status, 'published'));
    }
    
    const query = conditions.length > 0
      ? db.select().from(articles).where(and(...conditions))
      : db.select().from(articles);
    
    return await query.orderBy(desc(articles.publishedAt), desc(articles.createdAt));
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticleBySlug(slug: string, language?: string): Promise<Article | undefined> {
    const conditions = [eq(articles.slug, slug)];
    if (language) {
      conditions.push(eq(articles.language, language));
    }
    const [article] = await db.select().from(articles).where(and(...conditions));
    return article || undefined;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article> {
    const [updatedArticle] = await db
      .update(articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async incrementArticleViews(id: string): Promise<void> {
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, id));
  }

  // Homepage Content
  async getHomepageContent(language: string = "en"): Promise<HomepageContent | undefined> {
    const [content] = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.language, language));
    return content || undefined;
  }

  async upsertHomepageContent(content: InsertHomepageContent): Promise<HomepageContent> {
    const existing = await this.getHomepageContent(content.language || "en");
    
    if (existing) {
      const [updatedContent] = await db
        .update(homepageContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(homepageContent.language, content.language || "en"))
        .returning();
      return updatedContent;
    } else {
      const [newContent] = await db
        .insert(homepageContent)
        .values(content)
        .returning();
      return newContent;
    }
  }
}

export const storage = new DatabaseStorage();
