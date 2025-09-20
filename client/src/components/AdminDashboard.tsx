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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/ImageUpload";
import { Pencil, Trash2, Eye, Plus, Users, Briefcase, Mail, TrendingUp } from "lucide-react";
import type { Project, Client, Inquiry, Service, HomepageContent, Article, InsertArticle } from "@shared/schema";
import { insertArticleSchema } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  detailedDescription: z.string().optional(),
  category: z.enum(["residential", "commercial", "architecture"]),
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
  status: z.enum(["lead", "active", "completed"]).default("lead"),
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

type ProjectFormData = z.infer<typeof projectSchema>;
type ClientFormData = z.infer<typeof clientSchema>;
type ServiceFormData = z.infer<typeof serviceSchema>;
type ArticleFormData = InsertArticle;
type HomepageContentFormData = z.infer<typeof homepageContentSchema>;

interface AdminDashboardProps {
  activeTab: string;
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);

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
      status: "lead",
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

  const articleForm = useForm<ArticleFormData>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "general",
      tags: [],
      status: "draft",
      language: "en",
      featured: false,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  });

  const homepageContentForm = useForm<HomepageContentFormData>({
    resolver: zodResolver(homepageContentSchema),
    defaultValues: {
      language: language,
      heroTitle: "MODERNO INTERIORS",
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

  // Handlers
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    projectForm.reset({
      title: project.title,
      description: project.description || "",
      detailedDescription: project.detailedDescription || "",
      category: project.category as "residential" | "commercial" | "architecture",
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
    clientForm.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone || "",
      company: client.company || "",
      status: client.status as "lead" | "active" | "completed",
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
    if (editingClient) {
      // Update client logic would go here
    } else {
      await createClientMutation.mutateAsync(data);
    }
  };

  const onHomepageContentSubmit = async (data: HomepageContentFormData) => {
    await updateHomepageContentMutation.mutateAsync(data);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    articleForm.reset({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content,
      featuredImage: article.featuredImage || "",
      category: article.category as "news" | "tips" | "projects" | "design-trends",
      tags: Array.isArray(article.tags) ? article.tags as string[] : [],
      status: article.status as "draft" | "published" | "archived",
      language: article.language as "en" | "vi",
      featured: article.featured,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || "",
      metaKeywords: article.metaKeywords || "",
    });
    setIsArticleDialogOpen(true);
  };

  const onArticleSubmit = async (data: ArticleFormData) => {
    if (editingArticle) {
      await updateArticleMutation.mutateAsync({ id: editingArticle.id, data });
    } else {
      await createArticleMutation.mutateAsync(data);
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
                <Briefcase className="h-8 w-8 text-primary" />
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
                <Users className="h-8 w-8 text-primary" />
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
                <Mail className="h-8 w-8 text-primary" />
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
                <TrendingUp className="h-8 w-8 text-primary" />
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
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border animate-pulse">
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
                  <div key={inquiry.id} className="flex items-center justify-between py-3 border-b border-border">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project-category">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="architecture">Architecture</SelectItem>
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
                                  className="rounded border-border"
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
                      className="rounded border-border"
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
                        <div>
                          <p className="font-light">{project.title}</p>
                          {project.featured && (
                            <Badge variant="default" className="mt-1">Featured</Badge>
                          )}
                        </div>
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
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProject(project)}
                            data-testid={`button-edit-project-${project.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
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
          <h2 className="text-2xl font-sans font-light">Client Management</h2>
          <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-client">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Edit Client" : "Add New Client"}
                </DialogTitle>
              </DialogHeader>
              <Form {...clientForm}>
                <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-client-first-name" />
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
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-client-last-name" />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" data-testid="input-client-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={clientForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-client-status">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsClientDialogOpen(false);
                        setEditingClient(null);
                        clientForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createClientMutation.isPending}
                      data-testid="button-save-client"
                    >
                      {editingClient ? "Update" : "Create"} Client
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
                      <TableCell>
                        <p className="font-light">
                          {client.firstName} {client.lastName}
                        </p>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.company || "—"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            client.status === "active" ? "default" : 
                            client.status === "completed" ? "secondary" : "outline"
                          }
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(client.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClient(client)}
                          data-testid={`button-edit-client-${client.id}`}
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
                            <Button size="sm" variant="outline" data-testid={`button-view-inquiry-${inquiry.id}`}>
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
                  defaultValue="MODERNO INTERIORS - Interior Design Studio" 
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

  if (activeTab === 'articles') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-sans font-light">Articles Management</h2>
          <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-article">
                <Plus className="mr-2 h-4 w-4" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Article" : "Add New Article"}
                </DialogTitle>
              </DialogHeader>
              <Form {...articleForm}>
                <form onSubmit={articleForm.handleSubmit(onArticleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={articleForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-article-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={articleForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-article-slug" placeholder="auto-generated-if-empty" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={articleForm.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="textarea-article-excerpt" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={articleForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={8} data-testid="textarea-article-content" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={articleForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-article-category">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="news">News</SelectItem>
                              <SelectItem value="tips">Tips</SelectItem>
                              <SelectItem value="projects">Projects</SelectItem>
                              <SelectItem value="design-trends">Design Trends</SelectItem>
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

                    <FormField
                      control={articleForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-article-language">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="vi">Vietnamese</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={articleForm.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
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

                    <FormField
                      control={articleForm.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-article-featured-image" placeholder="Image URL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                              <Input {...field} data-testid="input-article-meta-title" placeholder="Custom SEO title (optional)" />
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
                              <Textarea {...field} rows={3} data-testid="textarea-article-meta-description" placeholder="Description for search engines (optional)" />
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
                              <Input {...field} data-testid="input-article-meta-keywords" placeholder="Comma-separated keywords (optional)" />
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
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <TableHead>Language</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>SEO</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" data-testid={`badge-category-${article.id}`}>
                          {article.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={article.status === 'published' ? 'default' : 'secondary'}
                          data-testid={`badge-status-${article.id}`}
                        >
                          {article.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" data-testid={`badge-language-${article.id}`}>
                          {article.language.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {article.featured && <Badge data-testid={`badge-featured-${article.id}`}>Featured</Badge>}
                      </TableCell>
                      <TableCell data-testid={`text-published-${article.id}`}>
                        {article.publishedAt ? formatDate(article.publishedAt) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {article.metaTitle && <Badge variant="outline" className="text-xs">Title</Badge>}
                          {article.metaDescription && <Badge variant="outline" className="text-xs">Desc</Badge>}
                          {article.metaKeywords && <Badge variant="outline" className="text-xs">Keywords</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditArticle(article)}
                            data-testid={`button-edit-article-${article.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteArticleMutation.mutate(article.id)}
                            data-testid={`button-delete-article-${article.id}`}
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
