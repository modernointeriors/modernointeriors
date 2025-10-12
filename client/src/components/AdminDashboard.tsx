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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/ImageUpload";
import { Pencil, Trash2, Eye, Plus, Users, Briefcase, Mail, TrendingUp, Star, Check, ChevronsUpDown, X } from "lucide-react";
import type { Project, Client, Inquiry, Service, HomepageContent, Article, InsertArticle, Partner, Category, Interaction, Deal } from "@shared/schema";
import { insertArticleSchema } from "@shared/schema";
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
  orderCount: z.number().optional(),
  referredById: z.string().optional(),
  referralCount: z.number().optional(),
  referralRevenue: z.string().optional(),
  referralCommission: z.string().optional(),
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
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaSecondaryButtonText: z.string().optional(),
});

const partnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  logo: z.string().min(1, "Partner logo is required"),
  website: z.string().optional(),
  description: z.string().optional(),
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

type ProjectFormData = z.infer<typeof projectSchema>;
type ClientFormData = z.infer<typeof clientSchema>;
type ServiceFormData = z.infer<typeof serviceSchema>;
type ArticleFormData = InsertArticle;
type BilingualArticleFormData = z.infer<typeof bilingualArticleSchema>;
type HomepageContentFormData = z.infer<typeof homepageContentSchema>;
type PartnerFormData = z.infer<typeof partnerSchema>;
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

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ['/api/transactions', editingClient?.id],
    queryFn: async () => {
      if (!editingClient?.id) return [];
      const response = await fetch(`/api/transactions?clientId=${editingClient.id}`);
      return response.json();
    },
    enabled: !!editingClient?.id,
  });

  // Query for all transactions (for total revenue calculation)
  const { data: allTransactions = [] } = useQuery<any[]>({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  // Forms
  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      detailedDescription: "",
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
      metaTitle: "",
      metaDescription: "",
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
      orderCount: 0,
      referredById: "",
      referralCount: 0,
      referralRevenue: "0",
      referralCommission: "0",
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
      website: "",
      description: "",
      order: 0,
      active: true,
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

  // Handlers
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    projectForm.reset({
      title: project.title,
      description: project.description || "",
      detailedDescription: project.detailedDescription || "",
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
      relatedProjects: Array.isArray(project.relatedProjects) ? project.relatedProjects as string[] : [],
      metaTitle: project.metaTitle || "",
      metaDescription: project.metaDescription || "",
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
      orderCount: client.orderCount || 0,
      referredById: client.referredById || "",
      referralCount: client.referralCount || 0,
      referralRevenue: client.referralRevenue || "0",
      referralCommission: client.referralCommission || "0",
      warrantyStatus: (client.warrantyStatus as "none" | "active" | "expired") || "none",
      warrantyExpiry: formatDateForInput(client.warrantyExpiry),
      tags: (client.tags as string[]) || [],
      notes: client.notes || "",
    });
    setIsClientDialogOpen(true);
  };

  const onProjectSubmit = async (data: ProjectFormData) => {
    if (editingProject) {
      await updateProjectMutation.mutateAsync({ id: editingProject.id, data });
    } else {
      await createProjectMutation.mutateAsync(data);
    }
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
    await updateHomepageContentMutation.mutateAsync(data);
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
      logo: partner.logo,
      website: partner.website || "",
      description: partner.description || "",
      order: partner.order,
      active: partner.active,
    });
    setIsPartnerDialogOpen(true);
  };

  const onPartnerSubmit = async (data: PartnerFormData) => {
    if (editingPartner) {
      await updatePartnerMutation.mutateAsync({ id: editingPartner.id, data });
    } else {
      await createPartnerMutation.mutateAsync(data);
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
              <Button data-testid="button-add-project">
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
                  <FormField
                    control={projectForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-project-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={projectForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="textarea-project-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="detailedDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} placeholder="Rich detailed content for project page..." data-testid="textarea-project-detailed-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        <FormControl>
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
                                  className="rounded border-white/20"
                                />
                                <label className="text-sm">{project.title}</label>
                              </div>
                            ))}
                            {projects.filter(p => p.id !== editingProject?.id).length === 0 && (
                              <p className="text-sm text-muted-foreground">No other projects available</p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h4 className="text-sm font-light">SEO Settings</h4>
                    <FormField
                      control={projectForm.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="SEO title for this project" data-testid="input-project-meta-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={projectForm.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={2} placeholder="SEO description for this project" data-testid="textarea-project-meta-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                      data-testid="button-save-project"
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
                            <Trash2 className="h-4 w-4" />
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
              clientForm.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingClient(null);
                  clientForm.reset();
                }}
                data-testid="button-add-client"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('crm.addClient')}
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                                    {transaction.type === "payment" ? "Thanh toán" : transaction.type === "refund" ? "Hoàn tiền" : "—"}
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
                            <Trash2 className="h-4 w-4" />
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
                            <AlertDialogCancel className="bg-black border-white/30 hover:border-white hover:bg-white/10 rounded-none">
                              Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteClientMutation.mutate(editingClient.id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-none"
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
                      >
                        {t('crm.cancel')}
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createClientMutation.isPending}
                        data-testid="button-save-client"
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black/50 backdrop-blur-xl border border-white/20">
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
                          {viewingClient.totalSpending ? `${parseFloat(viewingClient.totalSpending).toLocaleString('vi-VN')} đ` : "0 đ"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Order Count</label>
                        <p className="text-base mt-1">{viewingClient.orderCount || 0}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Refund Amount</label>
                        <p className="text-base mt-1 font-semibold text-red-500">
                          {viewingClient.refundAmount ? `${parseFloat(viewingClient.refundAmount).toLocaleString('vi-VN')} đ` : "0 đ"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Commission</label>
                        <p className="text-base mt-1 font-semibold text-green-500">
                          {viewingClient.referralCommission ? `${parseFloat(viewingClient.referralCommission).toLocaleString('vi-VN')} đ` : "0 đ"}
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
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('crm.referralCommission')}</label>
                        <p className="text-base mt-1">
                          {viewingClient.referralCommission ? `${parseFloat(viewingClient.referralCommission).toLocaleString('vi-VN')} đ` : "0 đ"}
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

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => {
                        setIsClientViewDialogOpen(false);
                        setViewingClient(null);
                      }}
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
            <DialogContent className="max-w-md bg-black/50 backdrop-blur-xl border border-white/20 rounded-none">
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
                    >
                      Hủy
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createTransactionMutation.isPending || updateTransactionMutation.isPending}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                        <TableHead className="w-[110px]">{t('crm.totalSpending')}</TableHead>
                        <TableHead className="w-[110px]">{t('crm.warrantyStatus')}</TableHead>
                        <TableHead className="w-[110px]">{t('crm.pipelineStage')}</TableHead>
                        <TableHead className="w-[100px]">{t('crm.customerTier')}</TableHead>
                        <TableHead className="w-[100px]">{t('crm.status')}</TableHead>
                        <TableHead className="w-[100px]">{t('crm.created')}</TableHead>
                        <TableHead className="text-right w-[70px]">{t('crm.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
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
                          <TableCell className="align-middle text-sm whitespace-nowrap">
                            {client.totalSpending ? `${parseFloat(client.totalSpending).toLocaleString('vi-VN')} đ` : "0 đ"}
                          </TableCell>
                          <TableCell className="align-middle">
                            <div className="text-sm capitalize" data-testid={`text-client-warranty-${client.id}`}>
                              {t(`crm.warranty.${client.warrantyStatus || 'none'}`)}
                            </div>
                            {client.warrantyExpiry && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(client.warrantyExpiry).toLocaleDateString('vi-VN')}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="align-middle">
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
                          </TableCell>
                          <TableCell className="align-middle">
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
                          </TableCell>
                          <TableCell className="align-middle">
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
                          </TableCell>
                          <TableCell className="align-middle text-sm whitespace-nowrap">{formatDate(client.createdAt)}</TableCell>
                          <TableCell className="align-middle text-right">
                            <div className="flex gap-1 justify-end">
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-2 text-right">
                  <span className="text-xs text-muted-foreground">
                    {t('crm.lastUpdated')}: {new Date().toLocaleString('vi-VN')}
                  </span>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Logo Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-light mb-2 block">Website Logo URL</label>
                <Input 
                  defaultValue={homepageContent?.logoUrl || ""}
                  placeholder="Enter logo URL (e.g., /attached_assets/logo.white.png)"
                  data-testid="input-logo-url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current logo: {homepageContent?.logoUrl || "Not set"}
                </p>
              </div>
              {homepageContent?.logoUrl && (
                <div className="border rounded-none p-4 bg-black/20">
                  <p className="text-sm font-light mb-2">Logo Preview:</p>
                  <img 
                    src={homepageContent.logoUrl} 
                    alt="Website Logo" 
                    className="h-12 w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                      if (errorMsg) errorMsg.style.display = 'block';
                    }}
                  />
                  <p className="text-xs text-red-500 mt-2" style={{display: 'none'}}>
                    Failed to load logo image
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-light mb-2 block">Hero Title</label>
                  <Input 
                    defaultValue={homepageContent?.heroTitle || "Moderno Interiors"}
                    data-testid="input-hero-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-light mb-2 block">Hero Studio</label>
                  <Input 
                    defaultValue={homepageContent?.heroStudio || "Design"}
                    data-testid="input-hero-studio"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">Hero Tagline</label>
                <Textarea 
                  defaultValue={homepageContent?.heroTagline || ""}
                  rows={2}
                  data-testid="textarea-hero-tagline"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-light mb-2 block">Architecture Label</label>
                  <Input 
                    defaultValue={homepageContent?.heroArchitectureLabel || ""}
                    data-testid="input-hero-architecture-label"
                  />
                </div>
                <div>
                  <label className="text-sm font-light mb-2 block">Interior Label</label>
                  <Input 
                    defaultValue={homepageContent?.heroInteriorLabel || ""}
                    data-testid="input-hero-interior-label"
                  />
                </div>
                <div>
                  <label className="text-sm font-light mb-2 block">Consultation Text</label>
                  <Input 
                    defaultValue={homepageContent?.heroConsultationText || ""}
                    data-testid="input-hero-consultation-text"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">Background Image URL</label>
                <Input 
                  defaultValue={homepageContent?.heroBackgroundImage || ""}
                  placeholder="Enter image URL"
                  data-testid="input-hero-background-image"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-light mb-2 block">Featured Badge</label>
                  <Input 
                    defaultValue={homepageContent?.featuredBadge || ""}
                    data-testid="input-featured-badge"
                  />
                </div>
                <div>
                  <label className="text-sm font-light mb-2 block">Featured Title</label>
                  <Input 
                    defaultValue={homepageContent?.featuredTitle || ""}
                    data-testid="input-featured-title"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">Featured Description</label>
                <Textarea 
                  defaultValue={homepageContent?.featuredDescription || ""}
                  rows={4}
                  data-testid="textarea-featured-description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stats Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-light mb-2 block">Projects Label</label>
                <Input 
                  defaultValue={homepageContent?.statsProjectsLabel || ""}
                  data-testid="input-stats-projects-label"
                />
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">Clients Label</label>
                <Input 
                  defaultValue={homepageContent?.statsClientsLabel || ""}
                  data-testid="input-stats-clients-label"
                />
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">Awards Label</label>
                <Input 
                  defaultValue={homepageContent?.statsAwardsLabel || ""}
                  data-testid="input-stats-awards-label"
                />
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">Experience Label</label>
                <Input 
                  defaultValue={homepageContent?.statsExperienceLabel || ""}
                  data-testid="input-stats-experience-label"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CTA Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-light mb-2 block">CTA Title</label>
                <Input 
                  defaultValue={homepageContent?.ctaTitle || ""}
                  data-testid="input-cta-title"
                />
              </div>
              <div>
                <label className="text-sm font-light mb-2 block">CTA Description</label>
                <Textarea 
                  defaultValue={homepageContent?.ctaDescription || ""}
                  rows={3}
                  data-testid="textarea-cta-description"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-light mb-2 block">Primary Button Text</label>
                  <Input 
                    defaultValue={homepageContent?.ctaButtonText || ""}
                    data-testid="input-cta-button-text"
                  />
                </div>
                <div>
                  <label className="text-sm font-light mb-2 block">Secondary Button Text</label>
                  <Input 
                    defaultValue={homepageContent?.ctaSecondaryButtonText || ""}
                    data-testid="input-cta-secondary-button-text"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button data-testid="button-save-homepage">Save Homepage Content</Button>
              </div>
            </div>
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
                            <Trash2 className="h-4 w-4" />
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
                            <Trash2 className="h-4 w-4" />
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
                                <Trash2 className="h-4 w-4" />
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
                <form onSubmit={partnerForm.handleSubmit(onPartnerSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={partnerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-partner-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={partnerForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-partner-website" placeholder="https://example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={partnerForm.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-partner-logo" placeholder="https://example.com/logo.png" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={partnerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="textarea-partner-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={partnerForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              data-testid="input-partner-order" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={partnerForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-none border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              data-testid="checkbox-partner-active"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Active Partner</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsPartnerDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" data-testid="button-save-partner">
                      {editingPartner ? "Update Partner" : "Add Partner"}
                    </Button>
                  </div>
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
                    <TableHead>Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="w-12 h-12 object-contain"
                          data-testid={`img-partner-logo-${partner.id}`}
                        />
                      </TableCell>
                      <TableCell data-testid={`text-partner-name-${partner.id}`}>
                        {partner.name}
                      </TableCell>
                      <TableCell>
                        {partner.website ? (
                          <a 
                            href={partner.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                            data-testid={`link-partner-website-${partner.id}`}
                          >
                            Visit Website
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell data-testid={`text-partner-order-${partner.id}`}>
                        {partner.order}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={partner.active ? 'default' : 'secondary'}
                          data-testid={`badge-partner-status-${partner.id}`}
                        >
                          {partner.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditPartner(partner)}
                            data-testid={`button-edit-partner-${partner.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deletePartnerMutation.mutate(partner.id)}
                            data-testid={`button-delete-partner-${partner.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
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
