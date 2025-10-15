import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/ImageUpload";
import { Pencil, Trash2, Eye, Plus, Users, Briefcase, Mail, TrendingUp, Star, Check, ChevronsUpDown, X } from "lucide-react";
import type { Project, Client, Inquiry, Service, HomepageContent, Article, InsertArticle, Partner, Category, Interaction, Deal, Faq, InsertFaq, JourneyStep, InsertJourneyStep } from "@shared/schema";
import { insertArticleSchema, insertFaqSchema, insertJourneyStepSchema } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  detailedDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
  area: z.string().optional(),
  duration: z.string().optional(),
  budget: z.string().optional(),
  style: z.string().optional(),
  designer: z.string().optional(),
  completionYear: z.string().optional(),
  // New image categories with specific constraints
  coverImages: z.array(z.string()).max(2, "Maximum 2 cover images allowed").default([]),
  contentImages: z.array(z.string()).max(2, "Maximum 2 content images allowed").default([]),
  galleryImages: z.array(z.string()).max(10, "Maximum 10 gallery images allowed").default([]),
  featured: z.boolean().default(false),
  // Legacy fields for backward compatibility  
  heroImage: z.string().optional(),
  images: z.array(z.string()).default([]), // Legacy field
  relatedProjects: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Bilingual project schema for form
const bilingualProjectSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleVi: z.string().min(1, "Vietnamese title is required"),
  descriptionEn: z.string().optional(),
  descriptionVi: z.string().optional(),
  detailedDescriptionEn: z.string().optional(),
  detailedDescriptionVi: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
  area: z.string().optional(),
  duration: z.string().optional(),
  budget: z.string().optional(),
  style: z.string().optional(),
  designer: z.string().optional(),
  completionYear: z.string().optional(),
  coverImages: z.array(z.string()).max(2, "Maximum 2 cover images allowed").default([]),
  contentImages: z.array(z.string()).max(2, "Maximum 2 content images allowed").default([]),
  galleryImages: z.array(z.string()).max(10, "Maximum 10 gallery images allowed").default([]),
  featured: z.boolean().default(false),
  heroImage: z.string().optional(),
  images: z.array(z.string()).default([]),
  relatedProjects: z.array(z.string()).default([]),
  metaTitleEn: z.string().optional(),
  metaTitleVi: z.string().optional(),
  metaDescriptionEn: z.string().optional(),
  metaDescriptionVi: z.string().optional(),
});

type BilingualProjectFormData = z.infer<typeof bilingualProjectSchema>;

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  stage: z.enum(["lead", "prospect", "contract", "delivery", "aftercare"]).default("lead"),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  tier: z.enum(["vip", "silver", "gold", "platinum"]).default("silver"),
  totalSpending: z.string().optional(),
  refundAmount: z.string().optional(),
  commission: z.string().optional(),
  orderCount: z.number().optional(),
  referredById: z.string().optional(),
  referralCount: z.number().optional(),
  referralRevenue: z.string().optional(),
  warrantyStatus: z.enum(["none", "active", "expired"]).default("none"),
  warrantyExpiry: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  features: z.array(z.string()).default([]),
  order: z.number().default(0),
  active: z.boolean().default(true),
});

const homepageContentSchema = z.object({
  language: z.string().default("en"),
  heroBackgroundImage: z.string().optional(),
  heroTitle: z.string().min(1, "Hero title is required"),
  heroStudio: z.string().min(1, "Studio text is required"),
  heroTagline: z.string().optional(),
  heroArchitectureLabel: z.string().optional(),
  heroInteriorLabel: z.string().optional(),
  heroConsultationText: z.string().optional(),
  featuredBadge: z.string().optional(),
  featuredTitle: z.string().optional(),
  featuredDescription: z.string().optional(),
  statsProjectsLabel: z.string().optional(),
  statsClientsLabel: z.string().optional(),
  statsAwardsLabel: z.string().optional(),
  statsExperienceLabel: z.string().optional(),
  journeyTitle: z.string().optional(),
  journeyDescription: z.string().optional(),
  advantagesTitle: z.string().optional(),
  advantagesSubtitle: z.string().optional(),
  faqSectionTitle: z.string().optional(),
  partnersTitle: z.string().optional(),
  featuredNewsTitle: z.string().optional(),
  featuredNewsSubtitle: z.string().optional(),
  ctaSubtitle: z.string().optional(),
  qualityBackgroundImage: z.string().optional(),
  qualityLeftText: z.string().optional(),
  qualityRightText: z.string().optional(),
  quality2BackgroundImage: z.string().optional(),
  quality2LeftText: z.string().optional(),
  quality2RightText: z.string().optional(),
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaSecondaryButtonText: z.string().optional(),
});

const partnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  logo: z.string().optional(), // Optional because we can use logoData instead
});

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  page: z.string().min(1, "Page is required"), // "home" or "contact"
  language: z.string().default("en"),
  order: z.number().default(0),
  active: z.boolean().default(true),
});

const interactionSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  type: z.enum(["visit", "meeting", "site_survey", "design", "acceptance", "call", "email"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  duration: z.number().optional(),
  location: z.string().optional(),
  assignedTo: z.string().optional(),
  outcome: z.string().optional(),
  nextAction: z.string().optional(),
  nextActionDate: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  createdBy: z.string().optional(),
});

const dealSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  value: z.string().min(1, "Value is required"),
  stage: z.enum(["proposal", "negotiation", "contract", "delivery", "completed", "lost"]).default("proposal"),
  probability: z.number().min(0).max(100).default(50),
  expectedCloseDate: z.string().optional(),
  actualCloseDate: z.string().optional(),
  description: z.string().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  lostReason: z.string().optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string().optional(),
});

const transactionSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  amount: z.string().min(1, "Amount is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  paymentDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

// Bilingual article schema for form
const bilingualArticleSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleVi: z.string().min(1, "Vietnamese title is required"),
  excerptEn: z.string().optional(),
  excerptVi: z.string().optional(),
  contentEn: z.string().min(1, "English content is required"),
  contentVi: z.string().min(1, "Vietnamese content is required"),
  slug: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

// Bilingual FAQ schema for form
const bilingualFaqSchema = z.object({
  questionEn: z.string().min(1, "English question is required"),
  questionVi: z.string().min(1, "Vietnamese question is required"),
  answerEn: z.string().min(1, "English answer is required"),
  answerVi: z.string().min(1, "Vietnamese answer is required"),
  page: z.string().min(1, "Page is required"),
});

// Advantage schema for form
const advantageSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  titleEn: z.string().min(1, "English title is required"),
  titleVi: z.string().min(1, "Vietnamese title is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionVi: z.string().min(1, "Vietnamese description is required"),
  active: z.boolean().default(true),
});

// Journey Step schema for form
const journeyStepSchema = z.object({
  stepNumber: z.number().min(1, "Step number is required"),
  titleEn: z.string().min(1, "English title is required"),
  titleVi: z.string().min(1, "Vietnamese title is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionVi: z.string().min(1, "Vietnamese description is required"),
  active: z.boolean().default(true),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type ClientFormData = z.infer<typeof clientSchema>;
type ServiceFormData = z.infer<typeof serviceSchema>;
type ArticleFormData = InsertArticle;
type BilingualArticleFormData = z.infer<typeof bilingualArticleSchema>;
type HomepageContentFormData = z.infer<typeof homepageContentSchema>;
type PartnerFormData = z.infer<typeof partnerSchema>;
type FaqFormData = z.infer<typeof faqSchema>;
type BilingualFaqFormData = z.infer<typeof bilingualFaqSchema>;
type AdvantageFormData = z.infer<typeof advantageSchema>;
type JourneyStepFormData = z.infer<typeof journeyStepSchema>;
type InteractionFormData = z.infer<typeof interactionSchema>;
type DealFormData = z.infer<typeof dealSchema>;
type TransactionFormData = z.infer<typeof transactionSchema>;

interface AdminDashboardProps {
  activeTab: string;
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { language, t } = useLanguage();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isClientViewDialogOpen, setIsClientViewDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"project" | "article">("article");
  const [referralOpen, setReferralOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null);
  
  // Partner Logo state
  const [partnerLogoFile, setPartnerLogoFile] = useState<File | null>(null);
  const [partnerLogoPreview, setPartnerLogoPreview] = useState<string>('');

  // Quality Section Background Image state
  const [qualityBgFile, setQualityBgFile] = useState<File | null>(null);
  const [qualityBgPreview, setQualityBgPreview] = useState<string>('');

  // Quality Section 2 Background Image state
  const [quality2BgFile, setQuality2BgFile] = useState<File | null>(null);
  const [quality2BgPreview, setQuality2BgPreview] = useState<string>('');

  // FAQ state
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isAdvantageDialogOpen, setIsAdvantageDialogOpen] = useState(false);
  const [editingAdvantage, setEditingAdvantage] = useState<any | null>(null);
  
  // Journey Step state
  const [isJourneyStepDialogOpen, setIsJourneyStepDialogOpen] = useState(false);
  const [editingJourneyStep, setEditingJourneyStep] = useState<JourneyStep | null>(null);

  // Queries
  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalProjects: number;
    activeClients: number;
    newInquiries: number;
    revenue: string;
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ['/api/inquiries'],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  const { data: homepageContent, isLoading: homepageContentLoading } = useQuery<HomepageContent>({
    queryKey: ['/api/homepage-content', language],
    queryFn: async () => {
      const response = await fetch(`/api/homepage-content?language=${language}`);
      return response.json();
    },
  });

  const { data: partners = [], isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ['/api/partners'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: faqs = [], isLoading: faqsLoading } = useQuery<Faq[]>({
    queryKey: ['/api/faqs'],
  });

  const { data: advantages = [], isLoading: advantagesLoading } = useQuery<any[]>({
    queryKey: ['/api/advantages'],
  });

  const { data: journeySteps = [], isLoading: journeyStepsLoading } = useQuery<JourneyStep[]>({
    queryKey: ['/api/journey-steps'],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ['/api/transactions', editingClient?.id],
    queryFn: async () => {
      if (!editingClient?.id) return [];
      const response = await fetch(`/api/transactions?clientId=${editingClient.id}`);
      return response.json();
    },
    enabled: !!editingClient?.id,
  });

  // Query transactions for viewing client
  const { data: viewTransactions = [], isLoading: viewTransactionsLoading } = useQuery<any[]>({
    queryKey: ['/api/transactions', viewingClient?.id],
    queryFn: async () => {
      if (!viewingClient?.id) return [];
      const response = await fetch(`/api/transactions?clientId=${viewingClient.id}`);
      return response.json();
    },
    enabled: !!viewingClient?.id,
  });

  // Query for all transactions (for total revenue calculation)
  const { data: allTransactions = [] } = useQuery<any[]>({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  // Settings/Logo query
  const { data: settings, isLoading: settingsLoading } = useQuery<any>({
    queryKey: ['/api/settings'],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = clients.slice(startIndex, endIndex);

  // Reset to page 1 when clients change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [clients.length, currentPage, totalPages]);

  // Forms
  const projectForm = useForm<BilingualProjectFormData>({
    resolver: zodResolver(bilingualProjectSchema),
    defaultValues: {
      titleEn: "",
      titleVi: "",
      descriptionEn: "",
      descriptionVi: "",
      detailedDescriptionEn: "",
      detailedDescriptionVi: "",
      slug: "",
      category: "residential",
      location: "",
      area: "",
      duration: "",
      budget: "",
      style: "",
      designer: "",
      completionYear: "",
      // New image categories
      coverImages: [],
      contentImages: [],
      galleryImages: [],
      featured: false,
      // Legacy fields for backward compatibility
      heroImage: "",
      images: [],
      relatedProjects: [],
      metaTitleEn: "",
      metaTitleVi: "",
      metaDescriptionEn: "",
      metaDescriptionVi: "",
    },
  });

  const clientForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      dateOfBirth: "",
      warrantyExpiry: "",
      stage: "lead",
      status: "active",
      tier: "silver",
      totalSpending: "0",
      refundAmount: "0",
      commission: "0",
      orderCount: 0,
      referredById: "",
      referralCount: 0,
      referralRevenue: "0",
      tags: [],
      notes: "",
    },
  });

  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "home",
      features: [],
      order: 0,
      active: true,
    },
  });

  const articleForm = useForm<BilingualArticleFormData>({
    resolver: zodResolver(bilingualArticleSchema),
    defaultValues: {
      titleEn: "",
      titleVi: "",
      excerptEn: "",
      excerptVi: "",
      contentEn: "",
      contentVi: "",
      slug: "",
      category: "news",
      status: "draft",
      featured: false,
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  });

  const homepageContentForm = useForm<HomepageContentFormData>({
    resolver: zodResolver(homepageContentSchema),
    defaultValues: {
      language: language,
      heroTitle: "Moderno Interiors",
      heroStudio: "STUDIO",
      heroTagline: "",
      heroArchitectureLabel: "",
      heroInteriorLabel: "",
      heroConsultationText: "",
      featuredBadge: "",
      featuredTitle: "",
      featuredDescription: "",
      statsProjectsLabel: "",
      statsClientsLabel: "",
      statsAwardsLabel: "",
      statsExperienceLabel: "",
      ctaTitle: "",
      ctaDescription: "",
      ctaButtonText: "",
      ctaSecondaryButtonText: "",
    },
  });

  const partnerForm = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      logo: "",
    },
  });

  const transactionForm = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      clientId: "",
      amount: "",
      title: "",
      description: "",
      type: "",
      status: "",
      paymentDate: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const faqForm = useForm<BilingualFaqFormData>({
    resolver: zodResolver(bilingualFaqSchema),
    defaultValues: {
      questionEn: "",
      questionVi: "",
      answerEn: "",
      answerVi: "",
      page: "home",
    },
  });

  const advantageForm = useForm<AdvantageFormData>({
    resolver: zodResolver(advantageSchema),
    defaultValues: {
      icon: "",
      titleEn: "",
      titleVi: "",
      descriptionEn: "",
      descriptionVi: "",
      active: true,
    },
  });

  const journeyStepForm = useForm<JourneyStepFormData>({
    resolver: zodResolver(journeyStepSchema),
    defaultValues: {
      stepNumber: 1,
      titleEn: "",
      titleVi: "",
      descriptionEn: "",
      descriptionVi: "",
      active: true,
    },
  });

  // Update form when content loads
  useEffect(() => {
    if (homepageContent && !homepageContentForm.formState.isDirty) {
      const formData = {
        ...homepageContent,
        heroBackgroundImage: homepageContent.heroBackgroundImage || undefined,
        heroTagline: homepageContent.heroTagline || undefined,
        heroArchitectureLabel: homepageContent.heroArchitectureLabel || undefined,
        heroInteriorLabel: homepageContent.heroInteriorLabel || undefined,
        heroConsultationText: homepageContent.heroConsultationText || undefined,
        featuredBadge: homepageContent.featuredBadge || undefined,
        featuredTitle: homepageContent.featuredTitle || undefined,
        featuredDescription: homepageContent.featuredDescription || undefined,
        statsProjectsLabel: homepageContent.statsProjectsLabel || undefined,
        statsClientsLabel: homepageContent.statsClientsLabel || undefined,
        statsAwardsLabel: homepageContent.statsAwardsLabel || undefined,
        statsExperienceLabel: homepageContent.statsExperienceLabel || undefined,
        journeyTitle: homepageContent.journeyTitle || undefined,
        journeyDescription: homepageContent.journeyDescription || undefined,
        advantagesTitle: homepageContent.advantagesTitle || undefined,
        advantagesSubtitle: homepageContent.advantagesSubtitle || undefined,
        faqSectionTitle: homepageContent.faqSectionTitle || undefined,
        partnersTitle: homepageContent.partnersTitle || undefined,
        featuredNewsTitle: homepageContent.featuredNewsTitle || undefined,
        featuredNewsSubtitle: homepageContent.featuredNewsSubtitle || undefined,
        ctaSubtitle: homepageContent.ctaSubtitle || undefined,
        qualityBackgroundImage: homepageContent.qualityBackgroundImage || undefined,
        qualityLeftText: homepageContent.qualityLeftText || undefined,
        qualityRightText: homepageContent.qualityRightText || undefined,
        quality2BackgroundImage: homepageContent.quality2BackgroundImage || undefined,
        quality2LeftText: homepageContent.quality2LeftText || undefined,
        quality2RightText: homepageContent.quality2RightText || undefined,
        ctaTitle: homepageContent.ctaTitle || undefined,
        ctaDescription: homepageContent.ctaDescription || undefined,
        ctaButtonText: homepageContent.ctaButtonText || undefined,
        ctaSecondaryButtonText: homepageContent.ctaSecondaryButtonText || undefined,
      };
      homepageContentForm.reset(formData);
    }
  }, [homepageContent, homepageContentForm]);

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await apiRequest('POST', '/api/projects', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: "Project created successfully" });
      projectForm.reset();
      setIsProjectDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectFormData> }) => {
      const response = await apiRequest('PUT', `/api/projects/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "Project updated successfully" });
      setEditingProject(null);
      setIsProjectDialogOpen(false);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: "Project deleted successfully" });
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const response = await apiRequest('POST', '/api/clients', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({ title: "Client created successfully" });
      clientForm.reset();
      setIsClientDialogOpen(false);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const response = await apiRequest('PUT', `/api/clients/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: "Client updated successfully" });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: "Đã xóa khách hàng thành công" });
      setIsClientDialogOpen(false);
      setEditingClient(null);
      clientForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi khi xóa khách hàng",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PUT', `/api/inquiries/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
      toast({ title: "Inquiry updated successfully" });
    },
  });

  const updateHomepageContentMutation = useMutation({
    mutationFn: async (data: HomepageContentFormData) => {
      const response = await apiRequest('PUT', '/api/homepage-content', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/homepage-content', language] });
      toast({ title: "Homepage content updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating homepage content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Article Mutations
  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const response = await apiRequest('POST', '/api/articles', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Article created successfully" });
      articleForm.reset();
      setIsArticleDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Partner Mutations
  const createPartnerMutation = useMutation({
    mutationFn: async (data: PartnerFormData) => {
      const response = await apiRequest('POST', '/api/partners', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/partners'] });
      toast({ title: "Partner created successfully" });
      partnerForm.reset();
      setIsPartnerDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating partner",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePartnerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PartnerFormData> }) => {
      const response = await apiRequest('PUT', `/api/partners/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/partners'] });
      toast({ title: "Partner updated successfully" });
      setEditingPartner(null);
      setIsPartnerDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating partner",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/partners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/partners'] });
      toast({ title: "Partner deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting partner",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createFaqMutation = useMutation({
    mutationFn: async (data: FaqFormData) => {
      const response = await apiRequest('POST', '/api/faqs', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === '/api/faqs' });
      toast({ title: "FAQ created successfully" });
      faqForm.reset();
      setIsFaqDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating FAQ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FaqFormData> }) => {
      const response = await apiRequest('PUT', `/api/faqs/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === '/api/faqs' });
      toast({ title: "FAQ updated successfully" });
      setEditingFaq(null);
      setIsFaqDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating FAQ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/faqs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === '/api/faqs' });
      toast({ title: "FAQ deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting FAQ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createAdvantageMutation = useMutation({
    mutationFn: async (data: AdvantageFormData) => {
      const response = await apiRequest('POST', '/api/advantages', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advantages'] });
      toast({ title: "Advantage created successfully" });
      advantageForm.reset();
      setIsAdvantageDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating advantage",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAdvantageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdvantageFormData> }) => {
      const response = await apiRequest('PUT', `/api/advantages/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advantages'] });
      toast({ title: "Advantage updated successfully" });
      setEditingAdvantage(null);
      setIsAdvantageDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating advantage",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAdvantageMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/advantages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/advantages'] });
      toast({ title: "Advantage deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting advantage",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createJourneyStepMutation = useMutation({
    mutationFn: async (data: JourneyStepFormData) => {
      const response = await apiRequest('POST', '/api/journey-steps', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journey-steps'] });
      toast({ title: "Journey step created successfully" });
      journeyStepForm.reset();
      setIsJourneyStepDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating journey step",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateJourneyStepMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<JourneyStepFormData> }) => {
      const response = await apiRequest('PATCH', `/api/journey-steps/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journey-steps'] });
      toast({ title: "Journey step updated successfully" });
      setEditingJourneyStep(null);
      setIsJourneyStepDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating journey step",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteJourneyStepMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/journey-steps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journey-steps'] });
      toast({ title: "Journey step deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting journey step",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ArticleFormData> }) => {
      const response = await apiRequest('PUT', `/api/articles/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Article updated successfully" });
      setEditingArticle(null);
      setIsArticleDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/articles/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Article deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; type: string; slug: string }) => {
      const response = await apiRequest('POST', '/api/categories', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "Category created successfully" });
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Transaction mutations
  const createTransactionMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const response = await apiRequest('POST', '/api/transactions', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: "Đã thêm giao dịch thành công" });
      transactionForm.reset();
      setIsTransactionDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi khi thêm giao dịch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TransactionFormData> }) => {
      const response = await apiRequest('PUT', `/api/transactions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({ title: "Đã cập nhật giao dịch thành công" });
      setEditingTransaction(null);
      transactionForm.reset();
      setIsTransactionDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi khi cập nhật giao dịch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({ title: "Đã xóa giao dịch thành công" });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi khi xóa giao dịch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logo settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', '/api/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Success",
        description: "Logo settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update logo settings",
        variant: "destructive"
      });
    }
  });

  // Handlers
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    
    // Find both language versions by slug
    const enVersion = projects.find(p => p.slug === project.slug && p.language === 'en');
    const viVersion = projects.find(p => p.slug === project.slug && p.language === 'vi');
    
    projectForm.reset({
      titleEn: enVersion?.title || "",
      titleVi: viVersion?.title || "",
      descriptionEn: enVersion?.description || "",
      descriptionVi: viVersion?.description || "",
      detailedDescriptionEn: enVersion?.detailedDescription || "",
      detailedDescriptionVi: viVersion?.detailedDescription || "",
      metaTitleEn: enVersion?.metaTitle || "",
      metaTitleVi: viVersion?.metaTitle || "",
      metaDescriptionEn: enVersion?.metaDescription || "",
      metaDescriptionVi: viVersion?.metaDescription || "",
      slug: project.slug || "",
      category: project.category,
      location: project.location || "",
      area: project.area || "",
      duration: project.duration || "",
      budget: project.budget || "",
      style: project.style || "",
      designer: project.designer || "",
      completionYear: project.completionYear || "",
      // New image categories
      coverImages: Array.isArray(project.coverImages) ? project.coverImages : [],
      contentImages: Array.isArray(project.contentImages) ? project.contentImages : [],
      galleryImages: Array.isArray(project.galleryImages) ? project.galleryImages : [],
      featured: project.featured,
      // Legacy fields for backward compatibility
      heroImage: project.heroImage || "",
      images: Array.isArray(project.images) ? project.images : [],
      relatedProjects: Array.isArray(project.relatedProjects) ? project.relatedProjects : [],
    });
    setIsProjectDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    
    // Format dates for input[type="date"] which expects YYYY-MM-DD
    const formatDateForInput = (dateValue: any) => {
      if (!dateValue) return "";
      const date = new Date(dateValue);
      return date.toISOString().split('T')[0];
    };
    
    clientForm.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone || "",
      company: client.company || "",
      address: client.address || "",
      dateOfBirth: formatDateForInput(client.dateOfBirth),
      stage: client.stage as "lead" | "prospect" | "contract" | "delivery" | "aftercare",
      status: client.status as "active" | "inactive" | "archived",
      tier: client.tier as "silver" | "gold" | "platinum" | "vip",
      totalSpending: client.totalSpending || "0",
      refundAmount: client.refundAmount || "0",
      commission: client.commission || "0",
      orderCount: client.orderCount || 0,
      referredById: client.referredById || "",
      referralCount: client.referralCount || 0,
      referralRevenue: client.referralRevenue || "0",
      warrantyStatus: (client.warrantyStatus as "none" | "active" | "expired") || "none",
      warrantyExpiry: formatDateForInput(client.warrantyExpiry),
      tags: (client.tags as string[]) || [],
      notes: client.notes || "",
    });
    setIsClientDialogOpen(true);
  };

  const onProjectSubmit = async (data: BilingualProjectFormData) => {
    // Generate slug if not provided
    const slug = data.slug || data.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Prepare English version
    const enProject = {
      title: data.titleEn,
      slug: slug,
      description: data.descriptionEn,
      detailedDescription: data.detailedDescriptionEn,
      category: data.category,
      location: data.location,
      area: data.area,
      duration: data.duration,
      budget: data.budget,
      style: data.style,
      designer: data.designer,
      completionYear: data.completionYear,
      coverImages: data.coverImages,
      contentImages: data.contentImages,
      galleryImages: data.galleryImages,
      featured: data.featured,
      heroImage: data.heroImage,
      images: data.images,
      relatedProjects: data.relatedProjects,
      metaTitle: data.metaTitleEn,
      metaDescription: data.metaDescriptionEn,
      language: 'en' as const,
      status: 'active' as const,
    };

    // Prepare Vietnamese version
    const viProject = {
      title: data.titleVi,
      slug: slug,
      description: data.descriptionVi,
      detailedDescription: data.detailedDescriptionVi,
      category: data.category,
      location: data.location,
      area: data.area,
      duration: data.duration,
      budget: data.budget,
      style: data.style,
      designer: data.designer,
      completionYear: data.completionYear,
      coverImages: data.coverImages,
      contentImages: data.contentImages,
      galleryImages: data.galleryImages,
      featured: data.featured,
      heroImage: data.heroImage,
      images: data.images,
      relatedProjects: data.relatedProjects,
      metaTitle: data.metaTitleVi,
      metaDescription: data.metaDescriptionVi,
      language: 'vi' as const,
      status: 'active' as const,
    };

    if (editingProject) {
      // Update both language versions
      const promises = [
        apiRequest('PATCH', `/api/projects/${editingProject.id}`, editingProject.language === 'en' ? enProject : viProject),
      ];
      
      // Find and update the other language version
      const otherLangProject = projects.find(
        p => p.slug === editingProject.slug && p.language !== editingProject.language
      );
      if (otherLangProject) {
        promises.push(
          apiRequest('PATCH', `/api/projects/${otherLangProject.id}`, otherLangProject.language === 'en' ? enProject : viProject)
        );
      }
      
      await Promise.all(promises);
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
    } else {
      // Create both versions
      await Promise.all([
        createProjectMutation.mutateAsync(enProject),
        createProjectMutation.mutateAsync(viProject),
      ]);
    }
    
    setIsProjectDialogOpen(false);
    setEditingProject(null);
    projectForm.reset();
  };

  const onClientSubmit = async (data: ClientFormData) => {
    // Auto-calculate warranty status based on expiry date
    let warrantyStatus: "none" | "active" | "expired" = "none";
    if (data.warrantyExpiry && data.warrantyExpiry.trim() !== "") {
      const expiryDate = new Date(data.warrantyExpiry);
      const now = new Date();
      warrantyStatus = expiryDate < now ? "expired" : "active";
    }

    // Clean up empty strings for optional date fields
    const cleanedData = {
      ...data,
      warrantyStatus, // Auto-set based on expiry date
      dateOfBirth: data.dateOfBirth && data.dateOfBirth.trim() !== "" ? data.dateOfBirth : undefined,
      warrantyExpiry: data.warrantyExpiry && data.warrantyExpiry.trim() !== "" ? data.warrantyExpiry : undefined,
      phone: data.phone && data.phone.trim() !== "" ? data.phone : undefined,
      company: data.company && data.company.trim() !== "" ? data.company : undefined,
      address: data.address && data.address.trim() !== "" ? data.address : undefined,
      referredById: data.referredById && data.referredById.trim() !== "" ? data.referredById : undefined,
      notes: data.notes && data.notes.trim() !== "" ? data.notes : undefined,
    };

    if (editingClient) {
      await updateClientMutation.mutateAsync({ id: editingClient.id, ...cleanedData });
      setEditingClient(null);
      setIsClientDialogOpen(false);
      clientForm.reset();
    } else {
      await createClientMutation.mutateAsync(cleanedData);
    }
  };

  const onHomepageContentSubmit = async (data: HomepageContentFormData) => {
    const submitData = { ...data };
    
    // Handle both quality background images if uploaded
    const processFiles = async () => {
      if (qualityBgFile) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(qualityBgFile);
        });
        submitData.qualityBackgroundImage = base64;
      }
      
      if (quality2BgFile) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(quality2BgFile);
        });
        submitData.quality2BackgroundImage = base64;
      }
      
      await updateHomepageContentMutation.mutateAsync(submitData);
      setQualityBgFile(null);
      setQualityBgPreview('');
      setQuality2BgFile(null);
      setQuality2BgPreview('');
    };
    
    await processFiles();
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    
    // Find both language versions by slug
    const enVersion = articles.find(a => a.slug === article.slug && a.language === 'en');
    const viVersion = articles.find(a => a.slug === article.slug && a.language === 'vi');
    
    articleForm.reset({
      titleEn: enVersion?.title || "",
      titleVi: viVersion?.title || "",
      excerptEn: enVersion?.excerpt || "",
      excerptVi: viVersion?.excerpt || "",
      contentEn: enVersion?.content || "",
      contentVi: viVersion?.content || "",
      slug: article.slug,
      category: article.category,
      status: article.status as "draft" | "published" | "archived",
      featured: article.featured,
      featuredImage: article.featuredImage || "",
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || "",
      metaKeywords: article.metaKeywords || "",
    });
    setIsArticleDialogOpen(true);
  };

  const onArticleSubmit = async (data: BilingualArticleFormData) => {
    // Generate slug if not provided
    const slug = data.slug || data.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Prepare English version
    const enArticle: InsertArticle = {
      title: data.titleEn,
      slug: slug,
      excerpt: data.excerptEn,
      content: data.contentEn,
      featuredImage: data.featuredImage,
      category: data.category,
      status: data.status,
      language: 'en',
      featured: data.featured,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,
      tags: [],
    };

    // Prepare Vietnamese version
    const viArticle: InsertArticle = {
      title: data.titleVi,
      slug: slug,
      excerpt: data.excerptVi,
      content: data.contentVi,
      featuredImage: data.featuredImage,
      category: data.category,
      status: data.status,
      language: 'vi',
      featured: data.featured,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,
      tags: [],
    };

    if (editingArticle) {
      // Find both versions
      const enVersion = articles.find(a => a.slug === editingArticle.slug && a.language === 'en');
      const viVersion = articles.find(a => a.slug === editingArticle.slug && a.language === 'vi');

      // Update or create EN version
      if (enVersion) {
        await updateArticleMutation.mutateAsync({ id: enVersion.id, data: enArticle });
      } else {
        await createArticleMutation.mutateAsync(enArticle);
      }

      // Update or create VI version
      if (viVersion) {
        await updateArticleMutation.mutateAsync({ id: viVersion.id, data: viArticle });
      } else {
        await createArticleMutation.mutateAsync(viArticle);
      }
    } else {
      // Create both versions
      await createArticleMutation.mutateAsync(enArticle);
      await createArticleMutation.mutateAsync(viArticle);
    }

    // Reset form and close dialog
    articleForm.reset();
    setEditingArticle(null);
    setIsArticleDialogOpen(false);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    partnerForm.reset({
      name: partner.name,
      logo: partner.logo || "",
    });
    // Set logo preview if partner has logoData
    if (partner.logoData) {
      setPartnerLogoPreview(partner.logoData);
    } else {
      setPartnerLogoPreview('');
    }
    setIsPartnerDialogOpen(true);
  };

  const onPartnerSubmit = async (data: PartnerFormData) => {
    const partnerData = {
      ...data,
      logoData: partnerLogoPreview || undefined,
      logo: partnerLogoPreview ? undefined : data.logo, // Only use URL if no file uploaded
    };
    
    if (editingPartner) {
      await updatePartnerMutation.mutateAsync({ id: editingPartner.id, data: partnerData });
    } else {
      await createPartnerMutation.mutateAsync(partnerData);
    }
    
    // Reset file states
    setPartnerLogoFile(null);
    setPartnerLogoPreview('');
  };

  const handleEditFaq = (group: { en: Faq | null, vi: Faq | null, order: number }) => {
    // Set the EN version as editingFaq to track which pair we're editing
    setEditingFaq(group.en || group.vi);
    faqForm.reset({
      questionEn: group.en?.question || "",
      questionVi: group.vi?.question || "",
      answerEn: group.en?.answer || "",
      answerVi: group.vi?.answer || "",
      page: 'home',
    });
    setIsFaqDialogOpen(true);
  };

  const onFaqSubmit = async (data: BilingualFaqFormData) => {
    // When creating new FAQ, find the max order and add 1
    const order = editingFaq ? editingFaq.order : Math.max(0, ...faqs.map(f => f.order)) + 1;

    const enData = {
      question: data.questionEn,
      answer: data.answerEn,
      page: data.page,
      language: 'en' as const,
      order: order,
      active: true,
    };

    const viData = {
      question: data.questionVi,
      answer: data.answerVi,
      page: data.page,
      language: 'vi' as const,
      order: order,
      active: true,
    };

    if (editingFaq) {
      // Find both EN and VI versions to update
      const enFaq = faqs.find(f => f.order === editingFaq.order && f.page === data.page && f.language === 'en');
      const viFaq = faqs.find(f => f.order === editingFaq.order && f.page === data.page && f.language === 'vi');

      const promises = [];
      if (enFaq) {
        promises.push(updateFaqMutation.mutateAsync({ id: enFaq.id, data: enData }));
      } else {
        promises.push(createFaqMutation.mutateAsync(enData));
      }

      if (viFaq) {
        promises.push(updateFaqMutation.mutateAsync({ id: viFaq.id, data: viData }));
      } else {
        promises.push(createFaqMutation.mutateAsync(viData));
      }

      await Promise.all(promises);
    } else {
      // Create both versions
      await Promise.all([
        createFaqMutation.mutateAsync(enData),
        createFaqMutation.mutateAsync(viData),
      ]);
    }
    
    setEditingFaq(null);
    setIsFaqDialogOpen(false);
  };

  const handleEditAdvantage = (advantage: any) => {
    setEditingAdvantage(advantage);
    advantageForm.reset({
      icon: advantage.icon || "",
      titleEn: advantage.titleEn || "",
      titleVi: advantage.titleVi || "",
      descriptionEn: advantage.descriptionEn || "",
      descriptionVi: advantage.descriptionVi || "",
      active: advantage.active !== undefined ? advantage.active : true,
    });
    setIsAdvantageDialogOpen(true);
  };

  const onAdvantageSubmit = async (data: AdvantageFormData) => {
    // When creating new advantage, find the max order and add 1
    const order = editingAdvantage ? editingAdvantage.order : Math.max(0, ...advantages.map(a => a.order)) + 1;
    const advantageData = { ...data, order };

    if (editingAdvantage) {
      await updateAdvantageMutation.mutateAsync({ id: editingAdvantage.id, data: advantageData });
    } else {
      await createAdvantageMutation.mutateAsync(advantageData);
    }
    
    setEditingAdvantage(null);
    setIsAdvantageDialogOpen(false);
  };

  const handleEditJourneyStep = (journeyStep: JourneyStep) => {
    setEditingJourneyStep(journeyStep);
    journeyStepForm.reset({
      stepNumber: journeyStep.stepNumber || 1,
      titleEn: journeyStep.titleEn || "",
      titleVi: journeyStep.titleVi || "",
      descriptionEn: journeyStep.descriptionEn || "",
      descriptionVi: journeyStep.descriptionVi || "",
      active: journeyStep.active !== undefined ? journeyStep.active : true,
    });
    setIsJourneyStepDialogOpen(true);
  };

  const onJourneyStepSubmit = async (data: JourneyStepFormData) => {
    // When creating new journey step, find the max order and add 1
    const order = editingJourneyStep ? editingJourneyStep.order : Math.max(0, ...journeySteps.map(j => j.order)) + 1;
    const journeyStepData = { ...data, order };

    if (editingJourneyStep) {
      await updateJourneyStepMutation.mutateAsync({ id: editingJourneyStep.id, data: journeyStepData });
    } else {
      await createJourneyStepMutation.mutateAsync(journeyStepData);
    }
    
    setEditingJourneyStep(null);
    setIsJourneyStepDialogOpen(false);
  };

  const handlePartnerLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeMB = 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      if (file.size > maxSizeBytes) {
        toast({
          title: "File quá lớn",
          description: `Kích thước file: ${fileSizeMB}MB. Giới hạn tối đa: ${maxSizeMB}MB. Vui lòng chọn file nhỏ hơn.`,
          variant: "destructive"
        });
        e.target.value = ''; // Reset input
        return;
      }

      setPartnerLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPartnerLogoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQualityBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeMB = 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      if (file.size > maxSizeBytes) {
        toast({
          title: "File quá lớn",
          description: `Kích thước file: ${fileSizeMB}MB. Giới hạn tối đa: ${maxSizeMB}MB. Vui lòng chọn file nhỏ hơn.`,
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }

      setQualityBgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setQualityBgPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuality2BgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeMB = 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      if (file.size > maxSizeBytes) {
        toast({
          title: "File quá lớn",
          description: `Kích thước file: ${fileSizeMB}MB. Giới hạn tối đa: ${maxSizeMB}MB. Vui lòng chọn file nhỏ hơn.`,
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }

      setQuality2BgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setQuality2BgPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    transactionForm.reset({
      clientId: transaction.clientId,
      amount: transaction.amount,
      title: transaction.title,
      description: transaction.description || "",
      type: transaction.type || "",
      status: transaction.status || "",
      paymentDate: transaction.paymentDate ? new Date(transaction.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: transaction.notes || "",
    });
    setIsTransactionDialogOpen(true);
  };

  const onTransactionSubmit = async (data: TransactionFormData) => {
    if (editingTransaction) {
      await updateTransactionMutation.mutateAsync({ id: editingTransaction.id, data });
    } else {
      await createTransactionMutation.mutateAsync(data);
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-light" data-testid="stat-total-projects">
                    {statsLoading ? "..." : stats?.totalProjects || 0}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-light" data-testid="stat-active-clients">
                    {statsLoading ? "..." : stats?.activeClients || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">New Inquiries</p>
                  <p className="text-2xl font-light" data-testid="stat-new-inquiries">
                    {statsLoading ? "..." : stats?.newInquiries || 0}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">Revenue (YTD)</p>
                  <p className="text-2xl font-light" data-testid="stat-revenue">
                    {statsLoading ? "..." : stats?.revenue || "$0"}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/20 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-64" />
                      <div className="h-3 bg-muted rounded w-32" />
                    </div>
                    <div className="h-8 bg-muted rounded w-16" />
                  </div>
                ))}
              </div>
            ) : inquiries.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {inquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between py-3 border-b border-white/20">
                    <div>
                      <p className="font-light">
                        New inquiry from {inquiry.firstName} {inquiry.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(inquiry.createdAt)} • {inquiry.projectType}
                      </p>
                    </div>
                    <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                      {inquiry.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'projects') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-sans font-light">Projects Management</h2>
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-project" className="h-10 px-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              <Form {...projectForm}>
                <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
                  {/* Bilingual Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="titleEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (English) *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-project-title-en" placeholder="Enter English title..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={projectForm.control}
                      name="titleVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Vietnamese) *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-project-title-vi" placeholder="Nhập tiêu đề tiếng Việt..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={projectForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories
                              .filter(cat => cat.type === 'project' && cat.active)
                              .map((category) => (
                                <SelectItem key={category.id} value={category.slug}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-project-location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={projectForm.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. 3,500 sq ft" data-testid="input-project-area" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bilingual Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="descriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (English)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="textarea-project-description-en" placeholder="Enter English description..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={projectForm.control}
                      name="descriptionVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Vietnamese)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="textarea-project-description-vi" placeholder="Nhập mô tả tiếng Việt..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bilingual Detailed Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="detailedDescriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description (English)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={5} placeholder="Enter detailed English content..." data-testid="textarea-project-detailed-description-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={projectForm.control}
                      name="detailedDescriptionVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description (Vietnamese)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={5} placeholder="Nhập nội dung chi tiết tiếng Việt..." data-testid="textarea-project-detailed-description-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="designer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interior Designer</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Nicolas Park" data-testid="input-project-designer" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={projectForm.control}
                      name="completionYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Completion Year</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. 2023" data-testid="input-project-year" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. 6 months" data-testid="input-project-duration" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={projectForm.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. $50,000" data-testid="input-project-budget" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={projectForm.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Modern, Contemporary" data-testid="input-project-style" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="coverImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Images (Maximum 2, 3:4 Aspect Ratio)</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            multiple
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="contentImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Images (2 Images, 16:9 or 1:1 Aspect Ratio)</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            multiple
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="galleryImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gallery Images (Maximum 10, 16:9 or 1:1 Aspect Ratio)</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            multiple
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Legacy fields for backward compatibility */}
                  <FormField
                    control={projectForm.control}
                    name="heroImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Image (Legacy - For Compatibility)</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value ? [field.value] : []}
                            onChange={(urls) => field.onChange(urls[0] || "")}
                            multiple={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legacy Images (Compatibility)</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            multiple
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="relatedProjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Projects</FormLabel>
                        <ScrollArea className="h-48 rounded-none border border-white/20 p-4">
                          <div className="space-y-2">
                            {projects.filter(p => p.id !== editingProject?.id).map((project) => (
                              <div key={project.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={field.value.includes(project.id)}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? [...field.value, project.id]
                                      : field.value.filter((id: string) => id !== project.id);
                                    field.onChange(newValue);
                                  }}
                                  className="rounded-none border-white/20"
                                />
                                <label className="text-sm">{project.title}</label>
                              </div>
                            ))}
                            {projects.filter(p => p.id !== editingProject?.id).length === 0 && (
                              <p className="text-sm text-muted-foreground">No other projects available</p>
                            )}
                          </div>
                        </ScrollArea>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bilingual SEO Settings */}
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-light">SEO Settings</h4>
                    
                    {/* SEO Meta Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={projectForm.control}
                        name="metaTitleEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title (English)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="SEO title in English..." data-testid="input-project-meta-title-en" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={projectForm.control}
                        name="metaTitleVi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title (Vietnamese)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Tiêu đề SEO tiếng Việt..." data-testid="input-project-meta-title-vi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* SEO Meta Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={projectForm.control}
                        name="metaDescriptionEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description (English)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} placeholder="SEO description in English..." data-testid="textarea-project-meta-description-en" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={projectForm.control}
                        name="metaDescriptionVi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description (Vietnamese)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} placeholder="Mô tả SEO tiếng Việt..." data-testid="textarea-project-meta-description-vi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...projectForm.register("featured")}
                      className="rounded border-white/20"
                      data-testid="checkbox-project-featured"
                    />
                    <label className="text-sm font-light">Featured Project</label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsProjectDialogOpen(false);
                        setEditingProject(null);
                        projectForm.reset();
                      }}
                      className="h-10 px-4"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                      data-testid="button-save-project"
                      className="h-10 px-4"
                    >
                      {editingProject ? "Update" : "Create"} Project
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {projectsLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-4 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-48" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                      <div className="h-8 bg-muted rounded w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-light mb-2">No projects found</h3>
                <p className="text-muted-foreground">Create your first project to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                      <TableCell>
                        <p className="font-light">{project.title}</p>
                      </TableCell>
                      <TableCell className="capitalize">{project.category}</TableCell>
                      <TableCell>{project.location || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditProject(project)}
                            data-testid={`button-edit-project-${project.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className={project.featured ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 hover:bg-yellow-500/30 hover:border-yellow-500" : ""}
                            onClick={() => {
                              updateProjectMutation.mutate({
                                id: project.id,
                                data: { featured: !project.featured }
                              });
                            }}
                            data-testid={`button-toggle-featured-${project.id}`}
                            title={project.featured ? "Remove from featured" : "Mark as featured"}
                          >
                            <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => deleteProjectMutation.mutate(project.id)}
                            data-testid={`button-delete-project-${project.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'clients') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-sans font-light">{t('crm.clientManagement')}</h2>
          <Dialog open={isClientDialogOpen} onOpenChange={(open) => {
            setIsClientDialogOpen(open);
            if (!open) {
              setEditingClient(null);
              clientForm.reset({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                company: "",
                address: "",
                dateOfBirth: "",
                tier: "silver",
                stage: "lead",
                status: "active",
                orderCount: 0,
                referredById: "",
                referralCount: 0,
                referralRevenue: "0",
                warrantyStatus: "none",
                warrantyExpiry: "",
                tags: [],
                notes: "",
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingClient(null);
                  clientForm.reset({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    company: "",
                    address: "",
                    dateOfBirth: "",
                    tier: "silver",
                    stage: "lead",
                    status: "active",
                    orderCount: 0,
                    referredById: "",
                    referralCount: 0,
                    referralRevenue: "0",
                    warrantyStatus: "none",
                    warrantyExpiry: "",
                    tags: [],
                    notes: "",
                  });
                }}
                data-testid="button-add-client"
                className="h-10 px-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('crm.addClient')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border border-white/20 rounded-none">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? t('crm.editClient') : t('crm.addClient')}
                </DialogTitle>
              </DialogHeader>
              <Form {...clientForm}>
                <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.firstName')} *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nguyễn" data-testid="input-client-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.lastName')} *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Văn A" data-testid="input-client-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={clientForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.email')} *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="email@example.com" data-testid="input-client-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.phone')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0901234567" data-testid="input-client-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.company')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ABC Company" data-testid="input-client-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={clientForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.address')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM" data-testid="input-client-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={clientForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.dateOfBirth')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" maxLength={10} data-testid="input-client-dob" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="warrantyExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.warrantyExpiry')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" maxLength={10} data-testid="input-client-warranty-expiry" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>{t('crm.warrantyStatus')}</FormLabel>
                      <div className="h-10 px-3 py-2 rounded-none border border-white/30 bg-white/5 flex items-center">
                        <span className="text-sm text-white/70">
                          {(() => {
                            const warrantyDate = clientForm.watch('warrantyExpiry');
                            if (!warrantyDate) return t('crm.warranty.none');
                            const expiry = new Date(warrantyDate);
                            const now = new Date();
                            return expiry < now ? t('crm.warranty.expired') : t('crm.warranty.active');
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.pipelineStage')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-client-stage">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="lead">{t('crm.stage.lead')}</SelectItem>
                              <SelectItem value="prospect">{t('crm.stage.prospect')}</SelectItem>
                              <SelectItem value="contract">{t('crm.stage.contract')}</SelectItem>
                              <SelectItem value="delivery">{t('crm.stage.delivery')}</SelectItem>
                              <SelectItem value="aftercare">{t('crm.stage.aftercare')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.customerTier')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-client-tier">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="silver">{t('crm.tier.silver')}</SelectItem>
                              <SelectItem value="gold">{t('crm.tier.gold')}</SelectItem>
                              <SelectItem value="platinum">{t('crm.tier.platinum')}</SelectItem>
                              <SelectItem value="vip">{t('crm.tier.vip')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={clientForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.status')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-client-status">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">{t('crm.status.active')}</SelectItem>
                            <SelectItem value="inactive">{t('crm.status.inactive')}</SelectItem>
                            <SelectItem value="archived">{t('crm.status.archived')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={clientForm.control}
                    name="referredById"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Người giới thiệu (Referral)</FormLabel>
                        <Popover open={referralOpen} onOpenChange={setReferralOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                data-testid="select-client-referral"
                                className="justify-between bg-black border-white/10 hover:border-white/30 hover:bg-white/10 rounded-none"
                              >
                                {field.value
                                  ? (() => {
                                      const client = clients.find((c) => c.id === field.value);
                                      return client ? `${client.firstName} ${client.lastName} (${client.email})` : "-- Không có --";
                                    })()
                                  : "-- Không có --"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0 bg-black/95 backdrop-blur-xl border-white/10 rounded-none">
                            <Command className="bg-transparent">
                              <CommandInput placeholder="Tìm kiếm người giới thiệu..." className="border-b border-white/10" />
                              <CommandEmpty>Không tìm thấy.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-auto">
                                <CommandItem
                                  value="none"
                                  onSelect={() => {
                                    field.onChange(undefined);
                                    setReferralOpen(false);
                                  }}
                                  className="hover:bg-white/10"
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${!field.value ? "opacity-100" : "opacity-0"}`}
                                  />
                                  -- Không có --
                                </CommandItem>
                                {clients
                                  .filter(c => !editingClient || c.id !== editingClient.id)
                                  .map((client) => (
                                    <CommandItem
                                      key={client.id}
                                      value={`${client.firstName} ${client.lastName} ${client.email}`}
                                      onSelect={() => {
                                        field.onChange(client.id);
                                        setReferralOpen(false);
                                      }}
                                      className="hover:bg-white/10"
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${field.value === client.id ? "opacity-100" : "opacity-0"}`}
                                      />
                                      {client.firstName} {client.lastName} ({client.email})
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Transaction Management - Only show when editing */}
                  {editingClient && (
                    <div className="border-t border-white/30 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Lịch sử giao dịch</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingTransaction(null);
                            transactionForm.reset({
                              clientId: editingClient.id,
                              amount: "",
                              title: "",
                              description: "",
                              type: "",
                              status: "",
                              paymentDate: new Date().toISOString().split('T')[0],
                              notes: "",
                            });
                            setIsTransactionDialogOpen(true);
                          }}
                          className="bg-black border-white/30 hover:border-white hover:bg-white/10 rounded-none h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {transactionsLoading ? (
                        <div className="text-sm text-white/50">Đang tải...</div>
                      ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                        <div className="text-sm text-white/50">Chưa có giao dịch nào</div>
                      ) : (
                        <div className="border border-white/30 rounded-none max-h-48 overflow-y-auto bg-black">
                          {transactions.map((transaction: any) => (
                            <div key={transaction.id} className="flex items-center justify-between px-2 py-2 border-b border-white/20 last:border-b-0 hover:bg-white/5 transition-colors">
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-white">{transaction.title}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/70 rounded-none">
                                    {transaction.type === "payment" ? "Thanh toán" : transaction.type === "refund" ? "Hoàn tiền" : transaction.type === "commission" ? "Commission" : "—"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-white">{parseFloat(transaction.amount).toLocaleString('vi-VN')} đ</span>
                                  <span className="text-[10px] text-white/50">
                                    {new Date(transaction.paymentDate).toLocaleDateString('vi-VN')}
                                  </span>
                                  <span className="text-[10px] text-white/50">
                                    {transaction.status === "pending" ? "Đang chờ" : transaction.status === "completed" ? "Hoàn thành" : transaction.status === "cancelled" ? "Đã hủy" : "—"}
                                  </span>
                                </div>
                                {transaction.description && (
                                  <p className="text-[10px] text-white/50">{transaction.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-0.5 ml-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingTransaction(transaction);
                                    transactionForm.reset({
                                      clientId: transaction.clientId,
                                      amount: transaction.amount,
                                      title: transaction.title,
                                      description: transaction.description || "",
                                      type: transaction.type || "",
                                      status: transaction.status || "",
                                      paymentDate: transaction.paymentDate ? new Date(transaction.paymentDate).toISOString().split('T')[0] : "",
                                      notes: transaction.notes || "",
                                    });
                                    setIsTransactionDialogOpen(true);
                                  }}
                                  className="h-6 w-6 text-white hover:text-white hover:bg-white/20 rounded-none"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    if (confirm(`Xóa giao dịch "${transaction.title}"?`)) {
                                      deleteTransactionMutation.mutate(transaction.id);
                                    }
                                  }}
                                  className="h-6 w-6 text-white hover:text-white hover:bg-white/20 rounded-none"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <FormField
                    control={clientForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.tags')}</FormLabel>
                        <FormControl>
                          <Input 
                            value={field.value?.join(', ') || ''} 
                            onChange={(e) => {
                              const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                              field.onChange(tagsArray);
                            }}
                            placeholder="VD: VIP, Ưu tiên, Khách hàng thân thiết..." 
                            data-testid="input-client-tags" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={clientForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.notes')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="Ghi chú về khách hàng..." data-testid="input-client-notes" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4 border-t border-white/30">
                    {editingClient && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="border-white/30 text-white hover:border-white hover:bg-white/10 rounded-none h-8 w-8"
                            data-testid="button-delete-client"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-none">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa khách hàng <strong>{editingClient.firstName} {editingClient.lastName}</strong>?
                              <br />
                              Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-black border-white/30 hover:border-white hover:bg-white/10 rounded-none h-10 px-4">
                              Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteClientMutation.mutate(editingClient.id)}
                              className="bg-white hover:bg-white/90 text-black rounded-none h-10 px-4"
                              disabled={deleteClientMutation.isPending}
                            >
                              {deleteClientMutation.isPending ? "Đang xóa..." : "Xóa"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <div className="flex space-x-2 ml-auto">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsClientDialogOpen(false);
                          setEditingClient(null);
                          clientForm.reset();
                        }}
                        className="h-10 px-4"
                      >
                        {t('crm.cancel')}
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createClientMutation.isPending}
                        data-testid="button-save-client"
                        className="h-10 px-4"
                      >
                        {editingClient ? t('crm.update') : t('crm.create')}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Client View Dialog */}
          <Dialog open={isClientViewDialogOpen} onOpenChange={setIsClientViewDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black border border-white/20 rounded-none">
              <DialogHeader>
                <DialogTitle className="text-2xl font-light">
                  {t('crm.clientDetails')}
                </DialogTitle>
              </DialogHeader>
              {viewingClient && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">{t('crm.basicInfo')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.name')}</label>
                        <p className="text-base mt-1">{viewingClient.firstName} {viewingClient.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.email')}</label>
                        <p className="text-base mt-1">{viewingClient.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.phone')}</label>
                        <p className="text-base mt-1">{viewingClient.phone || "—"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.dateOfBirth')}</label>
                        <p className="text-base mt-1">
                          {viewingClient.dateOfBirth ? new Date(viewingClient.dateOfBirth).toLocaleDateString('vi-VN') : "—"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.company')}</label>
                        <p className="text-base mt-1">{viewingClient.company || "—"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.address')}</label>
                        <p className="text-base mt-1">{viewingClient.address || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* CRM Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">{t('crm.crmStatus')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.pipelineStage')}</label>
                        <p className="text-base mt-1 capitalize">{t(`crm.stage.${viewingClient.stage}`)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.customerTier')}</label>
                        <p className="text-base mt-1 capitalize">{t(`crm.tier.${viewingClient.tier}`)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.status')}</label>
                        <p className="text-base mt-1 capitalize">{t(`crm.status.${viewingClient.status}`)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.created')}</label>
                        <p className="text-base mt-1">{formatDate(viewingClient.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">{t('crm.financialInfo')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Revenue</label>
                        <p className="text-base mt-1 font-semibold">
                          {viewingClient.totalSpending ? `${parseFloat(String(viewingClient.totalSpending)).toLocaleString('vi-VN')} đ` : "0 đ"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Order Count</label>
                        <p className="text-base mt-1">{viewingClient.orderCount || 0}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Refund Amount</label>
                        <p className="text-base mt-1 font-semibold text-white">
                          {viewingClient.refundAmount ? `${parseFloat(String(viewingClient.refundAmount)).toLocaleString('vi-VN')} đ` : "0 đ"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Referral Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">{t('crm.referralInfo')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Được giới thiệu bởi</label>
                        <p className="text-base mt-1">
                          {(() => {
                            if (!viewingClient.referredById) return "—";
                            const referrer = clients.find(c => c.id === viewingClient.referredById);
                            return referrer ? `${referrer.firstName} ${referrer.lastName}` : "—";
                          })()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.referralCount')}</label>
                        <p className="text-base mt-1">{viewingClient.referralCount || 0}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.referralRevenue')}</label>
                        <p className="text-base mt-1">
                          {viewingClient.referralRevenue ? `${parseFloat(viewingClient.referralRevenue).toLocaleString('vi-VN')} đ` : "0 đ"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warranty Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">{t('crm.warrantyInfo')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.warrantyStatus')}</label>
                        <p className="text-base mt-1 capitalize">{t(`crm.warranty.${viewingClient.warrantyStatus || 'none'}`)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.warrantyExpiry')}</label>
                        <p className="text-base mt-1">
                          {viewingClient.warrantyExpiry ? new Date(viewingClient.warrantyExpiry).toLocaleDateString('vi-VN') : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {viewingClient.tags && Array.isArray(viewingClient.tags) && viewingClient.tags.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium border-b pb-2">{t('crm.tags')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {viewingClient.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {viewingClient.notes && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium border-b pb-2">{t('crm.notes')}</h3>
                      <p className="text-base whitespace-pre-wrap">{viewingClient.notes}</p>
                    </div>
                  )}

                  {/* Transaction History */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Lịch sử giao dịch</h3>
                    {viewTransactionsLoading ? (
                      <div className="text-sm text-white/50">Đang tải...</div>
                    ) : !Array.isArray(viewTransactions) || viewTransactions.length === 0 ? (
                      <div className="text-sm text-white/50">Chưa có giao dịch nào</div>
                    ) : (
                      <div className="border border-white/30 rounded-none max-h-64 overflow-y-auto bg-black">
                        {viewTransactions.map((transaction: any) => (
                          <div key={transaction.id} className="flex items-center justify-between px-3 py-3 border-b border-white/20 last:border-b-0 hover:bg-white/5 transition-colors">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white">{transaction.title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/70 rounded-none">
                                  {transaction.type === "payment" ? "Thanh toán" : transaction.type === "refund" ? "Hoàn tiền" : transaction.type === "commission" ? "Commission" : "—"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-white">{parseFloat(transaction.amount).toLocaleString('vi-VN')} đ</span>
                                <span className="text-[10px] text-white/50">
                                  {new Date(transaction.paymentDate).toLocaleDateString('vi-VN')}
                                </span>
                                <span className="text-[10px] text-white/50">
                                  {transaction.status === "pending" ? "Đang chờ" : transaction.status === "completed" ? "Hoàn thành" : transaction.status === "cancelled" ? "Đã hủy" : "—"}
                                </span>
                              </div>
                              {transaction.description && (
                                <p className="text-[10px] text-white/50">{transaction.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => {
                        setIsClientViewDialogOpen(false);
                        setViewingClient(null);
                      }}
                      className="h-10 px-4"
                    >
                      {t('crm.close')}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Transaction Dialog */}
          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogContent className="max-w-md bg-black border border-white/20 rounded-none">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
                </DialogTitle>
              </DialogHeader>
              <Form {...transactionForm}>
                <form onSubmit={transactionForm.handleSubmit(onTransactionSubmit)} className="space-y-4">
                  <FormField
                    control={transactionForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="VD: Thanh toán đợt 1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={transactionForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả chi tiết</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="VD: Thanh toán thiết kế nội thất phòng khách" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={transactionForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số tiền (đ) *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={transactionForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-t-0 border-l-0 border-r-0 border-b border-white/30 rounded-none">
                                <SelectValue placeholder="Chọn loại" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="payment">Thanh toán</SelectItem>
                              <SelectItem value="refund">Hoàn tiền</SelectItem>
                              <SelectItem value="commission">Commission</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={transactionForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-t-0 border-l-0 border-r-0 border-b border-white/30 rounded-none">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Đang chờ</SelectItem>
                              <SelectItem value="completed">Hoàn thành</SelectItem>
                              <SelectItem value="cancelled">Đã hủy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={transactionForm.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày thanh toán *</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={transactionForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ghi chú thêm (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsTransactionDialogOpen(false);
                        setEditingTransaction(null);
                        transactionForm.reset();
                      }}
                      className="h-10 px-4"
                    >
                      Hủy
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createTransactionMutation.isPending || updateTransactionMutation.isPending}
                      className="h-10 px-4"
                    >
                      {editingTransaction ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black border-white/10 rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
                  <p className="text-2xl font-semibold mt-1">{clients.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-white/10 rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                  <p className="text-2xl font-semibold mt-1">
                    {allTransactions.reduce((sum, t) => {
                      if (t.status !== "completed") return sum;
                      const amount = parseFloat(t.amount || "0");
                      if (t.type === "payment") return sum + amount;
                      if (t.type === "refund") return sum - amount;
                      return sum;
                    }, 0).toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-white/10 rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hoa hồng chi</p>
                  <p className="text-2xl font-semibold mt-1">
                    {allTransactions.reduce((sum, t) => {
                      if (t.status !== "completed" || t.type !== "commission") return sum;
                      return sum + parseFloat(t.amount || "0");
                    }, 0).toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-white/10 rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng số lần thanh toán</p>
                  <p className="text-2xl font-semibold mt-1">
                    {allTransactions.length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {clientsLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-4 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-48" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                      <div className="h-8 bg-muted rounded w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ) : clients.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-light mb-2">No clients found</h3>
                <p className="text-muted-foreground">Add your first client to get started.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">
                          <div>{t('admin.clients')}</div>
                          <div className="text-xs font-normal text-muted-foreground mt-0.5">{t('crm.email')}</div>
                        </TableHead>
                        <TableHead className="w-[120px]">
                          <div>{t('crm.phone')}</div>
                          <div className="text-xs font-normal text-muted-foreground mt-0.5">{t('crm.dateOfBirth')}</div>
                        </TableHead>
                        <TableHead className="w-[130px]">
                          <div>{t('crm.address')}</div>
                          <div className="text-xs font-normal text-muted-foreground mt-0.5">{t('crm.company')}</div>
                        </TableHead>
                        <TableHead className="w-[110px]">
                          <div>{t('crm.totalSpending')}</div>
                          <div className="text-xs font-normal text-muted-foreground mt-0.5">Commission</div>
                        </TableHead>
                        <TableHead className="w-[110px] text-center">{t('crm.warrantyStatus')}</TableHead>
                        <TableHead className="w-[110px] text-center">{t('crm.pipelineStage')}</TableHead>
                        <TableHead className="w-[100px] text-center">{t('crm.customerTier')}</TableHead>
                        <TableHead className="w-[100px] text-center">{t('crm.status')}</TableHead>
                        <TableHead className="text-right w-[70px]">{t('crm.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedClients.map((client) => (
                        <TableRow key={client.id} data-testid={`row-client-${client.id}`} className="relative h-16">
                          <TableCell className="align-middle">
                            <div className="font-light whitespace-nowrap">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[140px] mt-1" title={client.email}>
                              {client.email}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle">
                            <div className="text-sm">{client.phone || "—"}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString('vi-VN') : "—"}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle">
                            <div className="text-sm truncate max-w-[110px]" title={client.address || ""}>
                              {client.address || "—"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[110px] mt-1" title={client.company || ""}>
                              {client.company || "—"}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle">
                            <div className="text-sm whitespace-nowrap">
                              {client.totalSpending ? `${parseFloat(client.totalSpending).toLocaleString('vi-VN')} đ` : "0 đ"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                              {client.commission ? `${parseFloat(client.commission).toLocaleString('vi-VN')} đ` : "0 đ"}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div className="text-sm capitalize" data-testid={`text-client-warranty-${client.id}`}>
                              {t(`crm.warranty.${client.warrantyStatus || 'none'}`)}
                            </div>
                            {client.warrantyExpiry && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(client.warrantyExpiry).toLocaleDateString('vi-VN')}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div className="inline-block w-full">
                              <Select
                                value={client.stage || "lead"}
                                onValueChange={(value) => updateClientMutation.mutate({ 
                                  id: client.id, 
                                  stage: value as "lead" | "prospect" | "contract" | "delivery" | "aftercare" 
                                })}
                              >
                                <SelectTrigger className="w-full" data-testid={`select-client-stage-${client.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lead">{t('crm.stage.lead')}</SelectItem>
                                  <SelectItem value="prospect">{t('crm.stage.prospect')}</SelectItem>
                                  <SelectItem value="contract">{t('crm.stage.contract')}</SelectItem>
                                  <SelectItem value="delivery">{t('crm.stage.delivery')}</SelectItem>
                                  <SelectItem value="aftercare">{t('crm.stage.aftercare')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div className="inline-block w-full">
                              <Select
                                value={client.tier || "silver"}
                                onValueChange={(value) => updateClientMutation.mutate({ 
                                  id: client.id, 
                                  tier: value as "silver" | "gold" | "platinum" | "vip" 
                                })}
                              >
                                <SelectTrigger className="w-full" data-testid={`select-client-tier-${client.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="silver">{t('crm.tier.silver')}</SelectItem>
                                  <SelectItem value="gold">{t('crm.tier.gold')}</SelectItem>
                                  <SelectItem value="platinum">{t('crm.tier.platinum')}</SelectItem>
                                  <SelectItem value="vip">{t('crm.tier.vip')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div className="inline-block w-full">
                              <Select
                                value={client.status || "active"}
                                onValueChange={(value) => updateClientMutation.mutate({ 
                                  id: client.id, 
                                  status: value as "active" | "inactive" | "archived" 
                                })}
                              >
                                <SelectTrigger className="w-full" data-testid={`select-client-status-${client.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">{t('crm.status.active')}</SelectItem>
                                  <SelectItem value="inactive">{t('crm.status.inactive')}</SelectItem>
                                  <SelectItem value="archived">{t('crm.status.archived')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-right">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setViewingClient(client);
                                    setIsClientViewDialogOpen(true);
                                  }}
                                  data-testid={`button-view-client-${client.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClient(client)}
                                  data-testid={`button-edit-client-${client.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-[10px] text-muted-foreground/50 whitespace-nowrap">
                                {formatDate(client.updatedAt || client.createdAt)}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="text-xs"
                    >
                      FIRST
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="text-xs"
                    >
                      PREV
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="text-xs min-w-[32px]"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="text-xs"
                    >
                      NEXT
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="text-xs"
                    >
                      LAST
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, clients.length)} of {clients.length} clients
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'inquiries') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-sans font-light">Inquiry Management</h2>

        <Card>
          <CardContent className="p-0">
            {inquiriesLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-4 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-48" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                      <div className="h-8 bg-muted rounded w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-light mb-2">No inquiries found</h3>
                <p className="text-muted-foreground">New inquiries will appear here when submitted.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-light">
                            {inquiry.firstName} {inquiry.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{inquiry.projectType}</TableCell>
                      <TableCell>{inquiry.budget || "—"}</TableCell>
                      <TableCell>
                        <Select
                          value={inquiry.status}
                          onValueChange={(value) => updateInquiryMutation.mutate({ id: inquiry.id, status: value })}
                        >
                          <SelectTrigger className="w-32" data-testid={`select-inquiry-status-${inquiry.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" data-testid={`button-view-inquiry-${inquiry.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Inquiry Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-light mb-1">Contact Information</h4>
                                <p>{inquiry.firstName} {inquiry.lastName}</p>
                                <p className="text-muted-foreground">{inquiry.email}</p>
                                {inquiry.phone && <p className="text-muted-foreground">{inquiry.phone}</p>}
                              </div>
                              <div>
                                <h4 className="font-light mb-1">Project Details</h4>
                                <p>Type: {inquiry.projectType}</p>
                                {inquiry.budget && <p>Budget: {inquiry.budget}</p>}
                              </div>
                              <div>
                                <h4 className="font-light mb-1">Message</h4>
                                <p className="text-muted-foreground">{inquiry.message}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'content') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-sans font-light">Content Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your service offerings and descriptions.
              </p>
              {servicesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No services configured</p>
                  ) : (
                    services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center">
                        <span className="text-sm">{service.title}</span>
                        <Badge variant={service.active ? "default" : "secondary"}>
                          {service.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload and manage project images and media assets.
              </p>
              <Button variant="outline" className="w-full" data-testid="button-manage-media">
                <Plus className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-light mb-2 block">Site Title</label>
                <Input 
                  defaultValue="Moderno Interiors - Interior Design" 
                  data-testid="input-site-title"
                />
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">Meta Description</label>
                <Textarea 
                  rows={3}
                  defaultValue="Premium interior design and architecture services. Transform your space with our expert design team."
                  data-testid="textarea-meta-description"
                />
              </div>
              <Button data-testid="button-save-seo">Save SEO Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'homepage') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-sans font-light">Homepage Content Management</h2>
        
        <Form {...homepageContentForm}>
          <form onSubmit={homepageContentForm.handleSubmit(onHomepageContentSubmit)} className="space-y-6">
            <Card>
          <CardHeader>
            <CardTitle>Section Titles Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Featured Projects */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Featured Projects Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Title (EN)</label>
                      <Input 
                        {...homepageContentForm.register("featuredBadge")}
                        placeholder="e.g., FEATURED PROJECTS"
                        data-testid="input-featured-projects-title-en"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Subtitle (EN)</label>
                      <Textarea 
                        {...homepageContentForm.register("featuredDescription")}
                        placeholder="e.g., Discover our latest projects where innovation meets elegance."
                        rows={2}
                        data-testid="textarea-featured-projects-subtitle-en"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Title (VI)</label>
                      <Input 
                        {...homepageContentForm.register("featuredBadgeVi")}
                        placeholder="e.g., DỰ ÁN NỔI BẬT"
                        data-testid="input-featured-projects-title-vi"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Subtitle (VI)</label>
                      <Textarea 
                        {...homepageContentForm.register("featuredDescriptionVi")}
                        placeholder="e.g., Khám phá các dự án mới nhất của chúng tôi nơi sự đổi mới gặp gỡ sự thanh lịch."
                        rows={2}
                        data-testid="textarea-featured-projects-subtitle-vi"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured News */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Featured News Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Title (EN)</label>
                      <Input 
                        {...homepageContentForm.register("featuredNewsTitle")}
                        placeholder="e.g., FEATURED NEWS"
                        data-testid="input-featured-news-title-en"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Subtitle (EN)</label>
                      <Textarea 
                        {...homepageContentForm.register("featuredNewsSubtitle")}
                        placeholder="e.g., Discover the latest design trends and expert insights from our professional team."
                        rows={2}
                        data-testid="textarea-featured-news-subtitle-en"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Title (VI)</label>
                      <Input 
                        {...homepageContentForm.register("featuredNewsTitleVi")}
                        placeholder="e.g., TIN TỨC NỔI BẬT"
                        data-testid="input-featured-news-title-vi"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Subtitle (VI)</label>
                      <Textarea 
                        {...homepageContentForm.register("featuredNewsSubtitleVi")}
                        placeholder="e.g., Khám phá xu hướng thiết kế mới nhất và những hiểu biết chuyên sâu từ đội ngũ chuyên nghiệp của chúng tôi."
                        rows={2}
                        data-testid="textarea-featured-news-subtitle-vi"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA/Questions */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">CTA/Questions Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Title (EN)</label>
                      <Input 
                        {...homepageContentForm.register("faqSectionTitle")}
                        placeholder="e.g., GOT QUESTIONS?"
                        data-testid="input-cta-title-en"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Subtitle (EN)</label>
                      <Textarea 
                        {...homepageContentForm.register("ctaSubtitle")}
                        placeholder="e.g., Leave a request for a free consultation and we will contact you as soon as possible."
                        rows={2}
                        data-testid="textarea-cta-subtitle-en"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Title (VI)</label>
                      <Input 
                        {...homepageContentForm.register("faqSectionTitleVi")}
                        placeholder="e.g., CÓ CÂU HỎI?"
                        data-testid="input-cta-title-vi"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Subtitle (VI)</label>
                      <Textarea 
                        {...homepageContentForm.register("ctaSubtitleVi")}
                        placeholder="e.g., Để lại yêu cầu tư vấn miễn phí và chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
                        rows={2}
                        data-testid="textarea-cta-subtitle-vi"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Journey Steps */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Journey Steps Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Journey Title (EN)</label>
                      <Input 
                        {...homepageContentForm.register("journeyTitle")}
                        placeholder="e.g., THE JOURNEY TO YOUR DREAM SPACE"
                        data-testid="input-journey-title-en"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Journey Description (EN)</label>
                      <Textarea 
                        {...homepageContentForm.register("journeyDescription")}
                        rows={3}
                        placeholder="Description for the journey/process section"
                        data-testid="textarea-journey-description-en"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Journey Title (VI)</label>
                      <Input 
                        {...homepageContentForm.register("journeyTitleVi")}
                        placeholder="e.g., HÀNH TRÌNH ĐẾN KHÔNG GIAN MONG ƯỚC"
                        data-testid="input-journey-title-vi"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Journey Description (VI)</label>
                      <Textarea 
                        {...homepageContentForm.register("journeyDescriptionVi")}
                        rows={3}
                        placeholder="Mô tả cho phần hành trình/quy trình"
                        data-testid="textarea-journey-description-vi"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advantages */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Advantages Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Advantages Title (EN)</label>
                      <Input 
                        {...homepageContentForm.register("advantagesTitle")}
                        placeholder="e.g., ADVANTAGES"
                        data-testid="input-advantages-title-en"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Advantages Subtitle (EN)</label>
                      <Input 
                        {...homepageContentForm.register("advantagesSubtitle")}
                        placeholder="e.g., Why Choose Moderno Interiors"
                        data-testid="input-advantages-subtitle-en"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Advantages Title (VI)</label>
                      <Input 
                        {...homepageContentForm.register("advantagesTitleVi")}
                        placeholder="e.g., ƯU ĐIỂM"
                        data-testid="input-advantages-title-vi"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Advantages Subtitle (VI)</label>
                      <Input 
                        {...homepageContentForm.register("advantagesSubtitleVi")}
                        placeholder="e.g., Tại Sao Chọn Moderno Interiors"
                        data-testid="input-advantages-subtitle-vi"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Partners */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Partners Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-light mb-2 block">Partners Title (EN)</label>
                    <Input 
                      {...homepageContentForm.register("partnersTitle")}
                      placeholder="e.g., OUR PARTNERS"
                      data-testid="input-partners-title-en"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-light mb-2 block">Partners Title (VI)</label>
                    <Input 
                      {...homepageContentForm.register("partnersTitleVi")}
                      placeholder="e.g., ĐỐI TÁC CỦA CHÚNG TÔI"
                      data-testid="input-partners-title-vi"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Button type="submit" className="w-full" data-testid="button-save-section-titles">
                Save Section Titles
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality/Banner Section 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Background Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Background Image</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleQualityBgFileChange}
                  className="block w-full text-sm text-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-none file:border-0
                    file:text-sm file:font-medium
                    file:bg-white file:text-black
                    hover:file:bg-white/90 cursor-pointer"
                  data-testid="input-quality-bg-file"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Format: PNG, JPG • Max: 10MB • Recommended: 1920x600px
                </p>
                {(qualityBgPreview || homepageContent?.qualityBackgroundImage) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="border rounded p-4 bg-muted">
                      <img 
                        src={qualityBgPreview || homepageContent?.qualityBackgroundImage || ''} 
                        alt="Quality BG Preview" 
                        className="w-full aspect-[16/6] object-cover rounded" 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-light mb-2 block">Left Text (Large)</label>
                <Textarea 
                  {...homepageContentForm.register("qualityLeftText")}
                  placeholder="e.g., Each detail is selected so that the interior will serve for a long time and look impeccable."
                  rows={3}
                  data-testid="textarea-quality-left-text"
                />
              </div>

              <div>
                <label className="text-sm font-light mb-2 block">Right Text (Small)</label>
                <Textarea 
                  {...homepageContentForm.register("qualityRightText")}
                  placeholder="e.g., We use only high-quality materials and furniture from trusted manufacturers."
                  rows={3}
                  data-testid="textarea-quality-right-text"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality/Banner Section 2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Background Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Background Image</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleQuality2BgFileChange}
                  className="block w-full text-sm text-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-none file:border-0
                    file:text-sm file:font-medium
                    file:bg-white file:text-black
                    hover:file:bg-white/90 cursor-pointer"
                  data-testid="input-quality2-bg-file"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Format: PNG, JPG • Max: 10MB • Recommended: 1920x600px
                </p>
                {(quality2BgPreview || homepageContent?.quality2BackgroundImage) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="border rounded p-4 bg-muted">
                      <img 
                        src={quality2BgPreview || homepageContent?.quality2BackgroundImage || ''} 
                        alt="Quality 2 BG Preview" 
                        className="w-full aspect-[16/6] object-cover rounded" 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-light mb-2 block">Left Text (Large)</label>
                <Textarea 
                  {...homepageContentForm.register("quality2LeftText")}
                  placeholder="e.g., Each detail is selected so that the interior will serve for a long time and look impeccable."
                  rows={3}
                  data-testid="textarea-quality2-left-text"
                />
              </div>

              <div>
                <label className="text-sm font-light mb-2 block">Right Text (Small)</label>
                <Textarea 
                  {...homepageContentForm.register("quality2RightText")}
                  placeholder="e.g., We use only high-quality materials and furniture from trusted manufacturers."
                  rows={3}
                  data-testid="textarea-quality2-right-text"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button 
            type="submit"
            disabled={updateHomepageContentMutation.isPending}
            data-testid="button-save-homepage"
            size="lg"
          >
            {updateHomepageContentMutation.isPending ? "Saving..." : "Save Homepage Content"}
          </Button>
        </div>
          </form>
        </Form>

        {/* Partners Management Section */}
        <Card className="bg-black border-white/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Partners Management</CardTitle>
              <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingPartner(null);
                    partnerForm.reset({
                      name: "",
                      logo: "",
                    });
                    setPartnerLogoPreview('');
                  }} data-testid="button-add-partner">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Partner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPartner ? "Edit Partner" : "Add New Partner"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...partnerForm}>
                    <form onSubmit={partnerForm.handleSubmit(onPartnerSubmit)} className="space-y-6">
                      <FormField
                        control={partnerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partner Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter partner name" data-testid="input-partner-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Partner Logo Upload */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Upload Logo (PNG, JPG only)</label>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handlePartnerLogoFileChange}
                            className="block w-full text-sm text-foreground
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-none file:border-0
                              file:text-sm file:font-medium
                              file:bg-primary file:text-primary-foreground
                              hover:file:bg-primary/90 cursor-pointer"
                            data-testid="input-partner-logo-file"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Định dạng: PNG, JPG • Giới hạn: 10MB • Khuyến nghị: 500x200px
                          </p>
                          {(partnerLogoPreview || editingPartner?.logoData || editingPartner?.logo) && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">Preview:</p>
                              <div className="border rounded p-4 bg-muted flex items-center justify-center">
                                <img 
                                  src={partnerLogoPreview || editingPartner?.logoData || editingPartner?.logo || ''} 
                                  alt="Partner Logo Preview" 
                                  className="h-24 object-contain" 
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Or Use URL */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or use URL</span>
                          </div>
                        </div>

                        <FormField
                          control={partnerForm.control}
                          name="logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://example.com/logo.png" data-testid="input-partner-logo" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={createPartnerMutation.isPending || updatePartnerMutation.isPending}
                        className="w-full"
                        data-testid="button-submit-partner"
                      >
                        {editingPartner ? "Update Partner" : "Add Partner"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {partnersLoading ? (
              <div className="text-white/70">Loading partners...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/70 w-24">Logo</TableHead>
                    <TableHead className="text-white/70">Name</TableHead>
                    <TableHead className="text-white/70 w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded p-2">
                          <img 
                            src={partner.logoData || partner.logo || ''} 
                            alt={partner.name}
                            className="max-w-full max-h-full object-contain"
                            data-testid={`img-partner-logo-${partner.id}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-light" data-testid={`text-partner-name-${partner.id}`}>
                        {partner.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPartner(partner)}
                            data-testid={`button-edit-partner-${partner.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePartnerMutation.mutate(partner.id)}
                            data-testid={`button-delete-partner-${partner.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* FAQ Management Section */}
        <Card className="bg-black border-white/10">
          <CardHeader>
            <CardTitle className="text-white">FAQ Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...faqForm}>
                    <form onSubmit={faqForm.handleSubmit(onFaqSubmit)} className="space-y-4">
                      <div className="space-y-4">
                        <div className="border rounded-md p-4 space-y-4">
                          <h3 className="font-medium text-sm text-muted-foreground">English Version</h3>
                          <FormField
                            control={faqForm.control}
                            name="questionEn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question (EN) *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-faq-question-en" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={faqForm.control}
                            name="answerEn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Answer (EN) *</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={4} data-testid="textarea-faq-answer-en" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                          <h3 className="font-medium text-sm text-muted-foreground">Vietnamese Version</h3>
                          <FormField
                            control={faqForm.control}
                            name="questionVi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question (VI) *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-faq-question-vi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={faqForm.control}
                            name="answerVi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Answer (VI) *</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={4} data-testid="textarea-faq-answer-vi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={createFaqMutation.isPending || updateFaqMutation.isPending}
                        data-testid="button-submit-faq"
                      >
                        {editingFaq ? "Update FAQ" : "Add FAQ"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

            {faqsLoading ? (
              <div className="text-white/70">Loading FAQs...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/70">Order</TableHead>
                    <TableHead className="text-white/70">Question (EN / VI)</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    // Group FAQs by order only (not page)
                    const groupedFaqs = faqs.reduce((acc, faq) => {
                      const key = `${faq.order}`;
                      if (!acc[key]) {
                        acc[key] = { en: null, vi: null, order: faq.order };
                      }
                      if (faq.language === 'en') {
                        acc[key].en = faq;
                      } else {
                        acc[key].vi = faq;
                      }
                      return acc;
                    }, {} as Record<string, { en: Faq | null, vi: Faq | null, order: number }>);

                    return Object.values(groupedFaqs)
                      .sort((a, b) => a.order - b.order)
                      .map((group, index) => {
                        const enFaq = group.en;
                        const viFaq = group.vi;
                        const displayFaq = enFaq || viFaq;
                        
                        if (!displayFaq) return null;
                        
                        return (
                          <TableRow key={`group-${index}`}>
                            <TableCell className="text-white/70">{displayFaq.order}</TableCell>
                            <TableCell className="text-white max-w-md" data-testid={`text-faq-group-${index}`}>
                              <div className="space-y-2">
                                {enFaq && (
                                  <div className="truncate">
                                    <span className="text-white/50 text-xs uppercase">EN:</span> {enFaq.question}
                                  </div>
                                )}
                                {viFaq && (
                                  <div className="truncate">
                                    <span className="text-white/50 text-xs uppercase">VI:</span> {viFaq.question}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                onClick={() => handleEditFaq(group)}
                                data-testid={`button-edit-faq-${index}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      });
                  })()}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Advantages Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Advantages Management (Why Choose Us)</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isAdvantageDialogOpen} onOpenChange={(open) => {
              setIsAdvantageDialogOpen(open);
              if (!open) {
                setEditingAdvantage(null);
                advantageForm.reset();
              }
            }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAdvantage ? "Edit Advantage" : "Add New Advantage"}</DialogTitle>
                  </DialogHeader>
                  <Form {...advantageForm}>
                    <form onSubmit={advantageForm.handleSubmit(onAdvantageSubmit)} className="space-y-4">
                      <FormField
                        control={advantageForm.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lucide Icon Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Sparkles, Headset, Users, Store" data-testid="input-advantage-icon" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <FormField
                            control={advantageForm.control}
                            name="titleEn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title (EN) *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-advantage-title-en" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={advantageForm.control}
                            name="descriptionEn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (EN) *</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} data-testid="textarea-advantage-description-en" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-4">
                          <FormField
                            control={advantageForm.control}
                            name="titleVi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title (VI) *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-advantage-title-vi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={advantageForm.control}
                            name="descriptionVi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (VI) *</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} data-testid="textarea-advantage-description-vi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={advantageForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Active</FormLabel>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                data-testid="checkbox-advantage-active"
                                className="h-4 w-4"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={createAdvantageMutation.isPending || updateAdvantageMutation.isPending}
                        data-testid="button-submit-advantage"
                      >
                        {editingAdvantage ? "Update Advantage" : "Add Advantage"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

            {advantagesLoading ? (
              <div className="text-white/70">Loading advantages...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/70">Order</TableHead>
                    <TableHead className="text-white/70">Title (EN / VI)</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advantages
                    .sort((a, b) => a.order - b.order)
                    .map((advantage, index) => (
                      <TableRow key={advantage.id}>
                        <TableCell className="text-white/70">{advantage.order}</TableCell>
                        <TableCell className="text-white max-w-md" data-testid={`text-advantage-${index}`}>
                          <div className="space-y-1">
                            <div className="truncate">
                              <span className="text-white/50 text-xs uppercase">EN:</span> {advantage.titleEn}
                            </div>
                            <div className="truncate">
                              <span className="text-white/50 text-xs uppercase">VI:</span> {advantage.titleVi}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleEditAdvantage(advantage)}
                              data-testid={`button-edit-advantage-${index}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" data-testid={`button-delete-advantage-${index}`}>
                                  <Trash2 className="h-4 w-4 text-white" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Advantage?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete "{advantage.titleEn}". This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteAdvantageMutation.mutate(advantage.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Journey Steps Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Journey Steps Management (Design Process)</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isJourneyStepDialogOpen} onOpenChange={(open) => {
              setIsJourneyStepDialogOpen(open);
              if (!open) {
                setEditingJourneyStep(null);
                journeyStepForm.reset();
              }
            }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingJourneyStep ? "Edit Journey Step" : "Add New Journey Step"}</DialogTitle>
                  </DialogHeader>
                  <Form {...journeyStepForm}>
                    <form onSubmit={journeyStepForm.handleSubmit(onJourneyStepSubmit)} className="space-y-4">
                      <FormField
                        control={journeyStepForm.control}
                        name="stepNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Step Number *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-journey-step-number" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <FormField
                            control={journeyStepForm.control}
                            name="titleEn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title (EN) *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-journey-step-title-en" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={journeyStepForm.control}
                            name="descriptionEn"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (EN) *</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} data-testid="textarea-journey-step-description-en" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-4">
                          <FormField
                            control={journeyStepForm.control}
                            name="titleVi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title (VI) *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-journey-step-title-vi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={journeyStepForm.control}
                            name="descriptionVi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (VI) *</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} data-testid="textarea-journey-step-description-vi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={journeyStepForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Active</FormLabel>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                data-testid="checkbox-journey-step-active"
                                className="h-4 w-4"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={createJourneyStepMutation.isPending || updateJourneyStepMutation.isPending}
                        data-testid="button-submit-journey-step"
                      >
                        {editingJourneyStep ? "Update Journey Step" : "Add Journey Step"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

            {journeyStepsLoading ? (
              <div className="text-white/70">Loading journey steps...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/70">Order</TableHead>
                    <TableHead className="text-white/70">Title (EN / VI)</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journeySteps
                    .sort((a, b) => a.order - b.order)
                    .map((journeyStep, index) => (
                      <TableRow key={journeyStep.id}>
                        <TableCell className="text-white/70">{journeyStep.order}</TableCell>
                        <TableCell className="text-white max-w-md" data-testid={`text-journey-step-${index}`}>
                          <div className="space-y-1">
                            <div className="truncate">
                              <span className="text-white/50 text-xs uppercase">EN:</span> {journeyStep.titleEn}
                            </div>
                            <div className="truncate">
                              <span className="text-white/50 text-xs uppercase">VI:</span> {journeyStep.titleVi}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            onClick={() => handleEditJourneyStep(journeyStep)}
                            data-testid={`button-edit-journey-step-${index}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'articles') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-sans font-light">Articles Management</h2>
        </div>

        {/* Categories Management Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Quản Lý Danh Mục</CardTitle>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-category">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={newCategoryType} onValueChange={(value: "project" | "article") => setNewCategoryType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article Category</SelectItem>
                          <SelectItem value="project">Project Category</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category Name</label>
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        data-testid="input-category-name"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCategoryDialogOpen(false);
                          setNewCategoryName("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (newCategoryName.trim()) {
                            const slug = newCategoryName
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, '');
                            createCategoryMutation.mutate({
                              name: newCategoryName,
                              type: newCategoryType,
                              slug,
                            });
                          }
                        }}
                        disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                        data-testid="button-save-category"
                      >
                        Create Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Article Categories</h3>
                <div className="space-y-2">
                  {categories.filter(cat => cat.type === 'article' && cat.active).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No article categories</p>
                  ) : (
                    categories
                      .filter(cat => cat.type === 'article' && cat.active)
                      .map((category) => (
                        <div key={category.id} className="flex justify-between items-center p-2 border rounded-none">
                          <span className="text-sm">{category.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete category "${category.name}"?`)) {
                                deleteCategoryMutation.mutate(category.id);
                              }
                            }}
                            data-testid={`button-delete-category-${category.slug}`}
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Project Categories</h3>
                <div className="space-y-2">
                  {categories.filter(cat => cat.type === 'project' && cat.active).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No project categories</p>
                  ) : (
                    categories
                      .filter(cat => cat.type === 'project' && cat.active)
                      .map((category) => (
                        <div key={category.id} className="flex justify-between items-center p-2 border rounded-none">
                          <span className="text-sm">{category.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete category "${category.name}"?`)) {
                                deleteCategoryMutation.mutate(category.id);
                              }
                            }}
                            data-testid={`button-delete-category-${category.slug}`}
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Articles</CardTitle>
              <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingArticle(null);
                      articleForm.reset({
                        titleEn: "",
                        titleVi: "",
                        excerptEn: "",
                        excerptVi: "",
                        contentEn: "",
                        contentVi: "",
                        slug: "",
                        category: "news",
                        status: "draft",
                        featured: false,
                        featuredImage: "",
                        metaTitle: "",
                        metaDescription: "",
                        metaKeywords: "",
                      });
                    }}
                    data-testid="button-add-article"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Article
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Article" : "Add New Article"}
                </DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto flex-1 px-1">
                <Form {...articleForm}>
                  <form onSubmit={articleForm.handleSubmit(onArticleSubmit)} className="space-y-6">
                  
                  {/* Bilingual Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={articleForm.control}
                      name="titleEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (English) *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-article-title-en" placeholder="Enter English title..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={articleForm.control}
                      name="titleVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Vietnamese) *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-article-title-vi" placeholder="Nhập tiêu đề tiếng Việt..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bilingual Excerpt */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={articleForm.control}
                      name="excerptEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt (English)</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ''} rows={4} data-testid="textarea-article-excerpt-en" placeholder="Brief description in English..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={articleForm.control}
                      name="excerptVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt (Vietnamese)</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ''} rows={4} data-testid="textarea-article-excerpt-vi" placeholder="Mô tả ngắn bằng tiếng Việt..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bilingual Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={articleForm.control}
                      name="contentEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content (English) *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={10} data-testid="textarea-article-content-en" placeholder="Write your content in English..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={articleForm.control}
                      name="contentVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content (Vietnamese) *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={10} data-testid="textarea-article-content-vi" placeholder="Viết nội dung bằng tiếng Việt..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Featured Image */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Images</h3>
                    <FormField
                      control={articleForm.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image (Upload from computer)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} data-testid="input-article-featured-image" placeholder="Drag and drop image here or click to select file" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Common Fields */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={articleForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-article-slug" placeholder="auto-generated" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={articleForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-article-category">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories
                                  .filter(cat => cat.type === 'article' && cat.active)
                                  .map((category) => (
                                    <SelectItem key={category.id} value={category.slug}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={articleForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-article-status">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={articleForm.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-none border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                data-testid="checkbox-article-featured"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Article</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* SEO Settings Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
                    <div className="space-y-4">
                      <FormField
                        control={articleForm.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} data-testid="input-article-meta-title" placeholder="Custom SEO title (optional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={articleForm.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} value={field.value || ''} rows={3} data-testid="textarea-article-meta-description" placeholder="Description for search engines (optional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={articleForm.control}
                        name="metaKeywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Keywords</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} data-testid="input-article-meta-keywords" placeholder="Comma-separated keywords (optional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsArticleDialogOpen(false);
                        setEditingArticle(null);
                        articleForm.reset();
                      }}
                      data-testid="button-cancel-article"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createArticleMutation.isPending || updateArticleMutation.isPending}
                      data-testid="button-save-article"
                    >
                      {editingArticle ? "Update Article" : "Create Article"}
                    </Button>
                  </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
            </Dialog>
            {articlesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>SEO</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    // Group articles by slug
                    const groupedArticles = articles.reduce((acc, article) => {
                      if (!acc[article.slug]) {
                        acc[article.slug] = [];
                      }
                      acc[article.slug].push(article);
                      return acc;
                    }, {} as Record<string, Article[]>);

                    return Object.entries(groupedArticles).map(([slug, articleGroup]) => {
                      const enVersion = articleGroup.find(a => a.language === 'en');
                      const viVersion = articleGroup.find(a => a.language === 'vi');
                      const displayArticle = enVersion || viVersion || articleGroup[0];
                      
                      const hasEn = !!enVersion;
                      const hasVi = !!viVersion;

                      return (
                        <TableRow key={slug} data-testid={`row-article-${slug}`}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{displayArticle.title}</p>
                              {!hasEn && <p className="text-xs text-yellow-500">Missing EN</p>}
                              {!hasVi && <p className="text-xs text-yellow-500">Missing VI</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" data-testid={`badge-category-${slug}`}>
                              {displayArticle.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={displayArticle.status === 'published' ? 'default' : 'secondary'}
                              data-testid={`badge-status-${slug}`}
                            >
                              {displayArticle.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {hasEn && <Badge variant="outline" className="text-xs">EN</Badge>}
                              {hasVi && <Badge variant="outline" className="text-xs">VI</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            {displayArticle.featured && <Badge data-testid={`badge-featured-${slug}`}>Featured</Badge>}
                          </TableCell>
                          <TableCell data-testid={`text-published-${slug}`}>
                            {displayArticle.publishedAt ? formatDate(displayArticle.publishedAt) : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {displayArticle.metaTitle && <Badge variant="outline" className="text-xs">Title</Badge>}
                              {displayArticle.metaDescription && <Badge variant="outline" className="text-xs">Desc</Badge>}
                              {displayArticle.metaKeywords && <Badge variant="outline" className="text-xs">Keywords</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => handleEditArticle(displayArticle)}
                                data-testid={`button-edit-article-${slug}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={async () => {
                                  // Delete all versions (en and vi)
                                  for (const article of articleGroup) {
                                    await deleteArticleMutation.mutateAsync(article.id);
                                  }
                                }}
                                data-testid={`button-delete-article-${slug}`}
                              >
                                <Trash2 className="h-4 w-4 text-white" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'partners') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-sans font-light">Partners Management</h2>
          <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-partner">
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPartner ? "Edit Partner" : "Add New Partner"}
                </DialogTitle>
              </DialogHeader>
              <Form {...partnerForm}>
                <form onSubmit={partnerForm.handleSubmit(onPartnerSubmit)} className="space-y-6">
                  <FormField
                    control={partnerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter partner name" data-testid="input-partner-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Partner Logo Upload */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Upload Logo (PNG, JPG only)</label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handlePartnerLogoFileChange}
                        className="block w-full text-sm text-foreground
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-none file:border-0
                          file:text-sm file:font-medium
                          file:bg-primary file:text-primary-foreground
                          hover:file:bg-primary/90 cursor-pointer"
                        data-testid="input-partner-logo-file"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Định dạng: PNG, JPG • Giới hạn: 10MB • Khuyến nghị: 500x200px
                      </p>
                      {(partnerLogoPreview || editingPartner?.logoData || editingPartner?.logo) && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <div className="border rounded p-4 bg-muted flex items-center justify-center">
                            <img 
                              src={partnerLogoPreview || editingPartner?.logoData || editingPartner?.logo || ''} 
                              alt="Partner Logo Preview" 
                              className="h-24 object-contain" 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Or Use URL */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or use URL</span>
                      </div>
                    </div>

                    <FormField
                      control={partnerForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/logo.png" data-testid="input-partner-logo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createPartnerMutation.isPending || updatePartnerMutation.isPending}
                    className="w-full"
                    data-testid="button-submit-partner"
                  >
                    {editingPartner ? "Update Partner" : "Add Partner"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partners</CardTitle>
          </CardHeader>
          <CardContent>
            {partnersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-4 border rounded">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-32" />
                      <div className="h-3 bg-muted rounded animate-pulse w-24" />
                    </div>
                    <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="w-16 h-16 flex items-center justify-center bg-muted rounded p-2">
                          <img 
                            src={partner.logoData || partner.logo || ''} 
                            alt={partner.name}
                            className="max-w-full max-h-full object-contain"
                            data-testid={`img-partner-logo-${partner.id}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-light" data-testid={`text-partner-name-${partner.id}`}>
                        {partner.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPartner(partner)}
                            data-testid={`button-edit-partner-${partner.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePartnerMutation.mutate(partner.id)}
                            data-testid={`button-delete-partner-${partner.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-muted-foreground">Select a tab to view content</p>
    </div>
  );
}
