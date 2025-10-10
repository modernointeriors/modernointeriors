import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { insertProjectSchema, insertClientSchema, insertInquirySchema, insertServiceSchema, insertArticleSchema, insertHomepageContentSchema, insertPartnerSchema, insertCategorySchema, insertInteractionSchema, insertDealSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { category, featured } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (featured) filters.featured = featured === 'true';
      
      const projects = await storage.getProjects(filters);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const { status } = req.query;
      const clients = await storage.getClients(status as string);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, validatedData);
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  // Inquiries routes
  app.get("/api/inquiries", async (req, res) => {
    try {
      const { status } = req.query;
      const inquiries = await storage.getInquiries(status as string);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.get("/api/inquiries/:id", async (req, res) => {
    try {
      const inquiry = await storage.getInquiry(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiry" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      
      // Check if client already exists by email
      let clientId = null;
      const existingClient = await storage.getClientByEmail(validatedData.email);
      
      if (existingClient) {
        clientId = existingClient.id;
      } else {
        // Create new client from inquiry data
        const newClient = await storage.createClient({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone || null,
          status: "lead"
        });
        clientId = newClient.id;
      }

      const inquiry = await storage.createInquiry({
        ...validatedData,
        clientId
      });
      
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  app.put("/api/inquiries/:id", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.partial().parse(req.body);
      const inquiry = await storage.updateInquiry(req.params.id, validatedData);
      res.json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Articles/Blog routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, featured, status, language, tags } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (featured) filters.featured = featured === 'true';
      if (status) filters.status = status as string;
      if (language) filters.language = language as string;
      if (tags) {
        // Parse tags if it's a comma-separated string
        filters.tags = typeof tags === 'string' ? tags.split(',') : tags;
      }
      
      const articles = await storage.getArticles(filters);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get("/api/articles/slug/:slug", async (req, res) => {
    try {
      const { language } = req.query;
      const article = await storage.getArticleBySlug(req.params.slug, language as string);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count for published articles
      if (article.status === 'published') {
        await storage.incrementArticleViews(article.id);
        // Return updated article with incremented view count
        const updatedArticle = await storage.getArticle(article.id);
        res.json(updatedArticle);
      } else {
        res.json(article);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      
      // Generate slug if not provided
      if (!validatedData.slug) {
        validatedData.slug = validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      // Set publishedAt if status is published and not already set
      if (validatedData.status === 'published' && !validatedData.publishedAt) {
        validatedData.publishedAt = new Date();
      }
      
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.partial().parse(req.body);
      
      // Update publishedAt if status is being set to published
      if (validatedData.status === 'published') {
        const currentArticle = await storage.getArticle(req.params.id);
        if (currentArticle && currentArticle.status !== 'published') {
          validatedData.publishedAt = new Date();
        }
      }
      
      const article = await storage.updateArticle(req.params.id, validatedData);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      await storage.deleteArticle(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Homepage Content routes
  app.get("/api/homepage-content", async (req, res) => {
    try {
      const { language = "en" } = req.query;
      const content = await storage.getHomepageContent(language as string);
      
      if (!content) {
        // Return default content if none exists
        const defaultContent = {
          language: language as string,
          heroTitle: "Moderno Interiors",
          heroStudio: "Design",
          heroTagline: "Transforming spaces into extraordinary experiences with sophisticated interior design",
          heroArchitectureLabel: "ARCHITECTURE",
          heroInteriorLabel: "INTERIOR",
          heroConsultationText: "FREE CONSULTATION",
          featuredBadge: "Featured Projects",
          featuredTitle: "Transforming Spaces",
          featuredDescription: "Discover our latest projects where innovation meets elegance.",
          statsProjectsLabel: "Projects",
          statsClientsLabel: "Clients",
          statsAwardsLabel: "Awards",
          statsExperienceLabel: "Years",
          ctaTitle: "Ready to Transform Your Space?",
          ctaDescription: "Let's collaborate to bring your vision to life.",
          ctaButtonText: "Start Your Project",
          ctaSecondaryButtonText: "View Our Portfolio"
        };
        return res.json(defaultContent);
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch homepage content" });
    }
  });

  app.put("/api/homepage-content", async (req, res) => {
    try {
      const validatedData = insertHomepageContentSchema.parse(req.body);
      const content = await storage.upsertHomepageContent(validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update homepage content" });
    }
  });

  // Partners routes
  app.get("/api/partners", async (req, res) => {
    try {
      const { active } = req.query;
      const partners = await storage.getPartners(active === 'true' ? true : active === 'false' ? false : undefined);
      res.json(partners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  app.get("/api/partners/:id", async (req, res) => {
    try {
      const partner = await storage.getPartner(req.params.id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partner" });
    }
  });

  app.post("/api/partners", async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(validatedData);
      res.status(201).json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create partner" });
    }
  });

  app.put("/api/partners/:id", async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.partial().parse(req.body);
      const partner = await storage.updatePartner(req.params.id, validatedData);
      res.json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update partner" });
    }
  });

  app.delete("/api/partners/:id", async (req, res) => {
    try {
      await storage.deletePartner(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete partner" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const { type, active } = req.query;
      const categories = await storage.getCategories(
        type as string, 
        active === 'true' ? true : active === 'false' ? false : undefined
      );
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // CRM: Interactions routes
  app.get("/api/interactions", async (req, res) => {
    try {
      const { clientId } = req.query;
      const interactions = await storage.getInteractions(clientId as string);
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interactions" });
    }
  });

  app.get("/api/interactions/:id", async (req, res) => {
    try {
      const interaction = await storage.getInteraction(req.params.id);
      if (!interaction) {
        return res.status(404).json({ message: "Interaction not found" });
      }
      res.json(interaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interaction" });
    }
  });

  app.post("/api/interactions", async (req, res) => {
    try {
      const validatedData = insertInteractionSchema.parse(req.body);
      const interaction = await storage.createInteraction(validatedData);
      res.status(201).json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create interaction" });
    }
  });

  app.put("/api/interactions/:id", async (req, res) => {
    try {
      const validatedData = insertInteractionSchema.partial().parse(req.body);
      const interaction = await storage.updateInteraction(req.params.id, validatedData);
      res.json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update interaction" });
    }
  });

  app.delete("/api/interactions/:id", async (req, res) => {
    try {
      await storage.deleteInteraction(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete interaction" });
    }
  });

  // CRM: Deals routes
  app.get("/api/deals", async (req, res) => {
    try {
      const { clientId, stage } = req.query;
      const filters: any = {};
      if (clientId) filters.clientId = clientId as string;
      if (stage) filters.stage = stage as string;
      
      const deals = await storage.getDeals(filters);
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  app.put("/api/deals/:id", async (req, res) => {
    try {
      const validatedData = insertDealSchema.partial().parse(req.body);
      const deal = await storage.updateDeal(req.params.id, validatedData);
      res.json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      await storage.deleteDeal(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // CRM: Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const { clientId } = req.query;
      const transactions = await storage.getTransactions(clientId as string | undefined);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(req.params.id, validatedData);
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      await storage.deleteTransaction(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  // CRM: Analytics routes
  app.get("/api/clients/:id/referrals", async (req, res) => {
    try {
      const referrals = await storage.getClientReferrals(req.params.id);
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  app.post("/api/clients/:id/update-tier", async (req, res) => {
    try {
      await storage.updateClientTier(req.params.id);
      const updatedClient = await storage.getClient(req.params.id);
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client tier" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const [allProjects, activeClients, newInquiries] = await Promise.all([
        storage.getProjects(),
        storage.getClients("active"),
        storage.getInquiries("new")
      ]);

      res.json({
        totalProjects: allProjects.length,
        activeClients: activeClients.length,
        newInquiries: newInquiries.length,
        revenue: "$2.4M" // This would come from project budgets in a real app
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
