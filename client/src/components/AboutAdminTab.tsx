import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import type { AboutPageContent, AboutPrinciple, AboutShowcaseService, AboutProcessStep, AboutTeamMember, InsertAboutPageContent, InsertAboutPrinciple, InsertAboutShowcaseService, InsertAboutProcessStep, InsertAboutTeamMember } from "@shared/schema";
import { insertAboutPageContentSchema, insertAboutPrincipleSchema, insertAboutShowcaseServiceSchema, insertAboutProcessStepSchema, insertAboutTeamMemberSchema } from "@shared/schema";
import ImageUpload from "@/components/ImageUpload";

interface AboutAdminTabProps {
  aboutContent?: AboutPageContent;
  aboutPrinciples: AboutPrinciple[];
  aboutShowcaseServices: AboutShowcaseService[];
  aboutProcessSteps: AboutProcessStep[];
  aboutTeamMembers: AboutTeamMember[];
  aboutContentLoading: boolean;
  aboutPrinciplesLoading: boolean;
  aboutShowcaseServicesLoading: boolean;
  aboutProcessStepsLoading: boolean;
  aboutTeamMembersLoading: boolean;
  onAboutContentSubmit: (data: InsertAboutPageContent) => Promise<void>;
  onPrincipleSubmit: (data: InsertAboutPrinciple) => Promise<void>;
  onShowcaseServiceSubmit: (data: InsertAboutShowcaseService) => Promise<void>;
  onProcessStepSubmit: (data: InsertAboutProcessStep) => Promise<void>;
  onTeamMemberSubmit: (data: InsertAboutTeamMember) => Promise<void>;
  updatePrincipleMutation: any;
  deletePrincipleMutation: any;
  updateShowcaseServiceMutation: any;
  deleteShowcaseServiceMutation: any;
  updateProcessStepMutation: any;
  deleteProcessStepMutation: any;
  updateTeamMemberMutation: any;
  deleteTeamMemberMutation: any;
  updateAboutContentMutation: any;
  showcaseBannerFile: File | null;
  showcaseBannerPreview: string;
  handleShowcaseBannerFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTeamMemberDialogOpen: boolean;
  setIsTeamMemberDialogOpen: (open: boolean) => void;
  editingTeamMember: AboutTeamMember | null;
  setEditingTeamMember: (member: AboutTeamMember | null) => void;
  teamMemberForm: any;
}

export default function AboutAdminTab({
  aboutContent,
  aboutPrinciples,
  aboutShowcaseServices,
  aboutProcessSteps,
  aboutTeamMembers,
  aboutContentLoading,
  aboutPrinciplesLoading,
  aboutShowcaseServicesLoading,
  aboutProcessStepsLoading,
  aboutTeamMembersLoading,
  onAboutContentSubmit,
  onPrincipleSubmit,
  onShowcaseServiceSubmit,
  onProcessStepSubmit,
  onTeamMemberSubmit,
  updatePrincipleMutation,
  deletePrincipleMutation,
  updateShowcaseServiceMutation,
  deleteShowcaseServiceMutation,
  updateProcessStepMutation,
  deleteProcessStepMutation,
  updateTeamMemberMutation,
  deleteTeamMemberMutation,
  updateAboutContentMutation,
  showcaseBannerFile,
  showcaseBannerPreview,
  handleShowcaseBannerFileChange,
  isTeamMemberDialogOpen,
  setIsTeamMemberDialogOpen,
  editingTeamMember,
  setEditingTeamMember,
  teamMemberForm,
}: AboutAdminTabProps) {
  
  const [isPrincipleDialogOpen, setIsPrincipleDialogOpen] = useState(false);
  const [editingPrinciple, setEditingPrinciple] = useState<AboutPrinciple | null>(null);
  const [isShowcaseServiceDialogOpen, setIsShowcaseServiceDialogOpen] = useState(false);
  const [editingShowcaseService, setEditingShowcaseService] = useState<AboutShowcaseService | null>(null);
  const [isProcessStepDialogOpen, setIsProcessStepDialogOpen] = useState(false);
  const [editingProcessStep, setEditingProcessStep] = useState<AboutProcessStep | null>(null);

  const aboutContentForm = useForm<InsertAboutPageContent>({
    resolver: zodResolver(insertAboutPageContentSchema),
    defaultValues: aboutContent || {
      heroTitleEn: "",
      heroTitleVi: "",
      heroSubtitleEn: "",
      heroSubtitleVi: "",
      principlesTitleEn: "",
      principlesTitleVi: "",
      showcaseBannerImage: "",
      statsProjectsValue: "",
      statsProjectsLabelEn: "",
      statsProjectsLabelVi: "",
      statsAwardsValue: "",
      statsAwardsLabelEn: "",
      statsAwardsLabelVi: "",
      statsClientsValue: "",
      statsClientsLabelEn: "",
      statsClientsLabelVi: "",
      statsCountriesValue: "",
      statsCountriesLabelEn: "",
      statsCountriesLabelVi: "",
      processTitleEn: "",
      processTitleVi: "",
      historyTitleEn: "",
      historyTitleVi: "",
      historyContentEn: "",
      historyContentVi: "",
      missionTitleEn: "",
      missionTitleVi: "",
      missionContentEn: "",
      missionContentVi: "",
      visionTitleEn: "",
      visionTitleVi: "",
      visionContentEn: "",
      visionContentVi: "",
      coreValuesTitleEn: "",
      coreValuesTitleVi: "",
      teamTitleEn: "",
      teamTitleVi: "",
    },
  });

  const principleForm = useForm<InsertAboutPrinciple>({
    resolver: zodResolver(insertAboutPrincipleSchema),
    defaultValues: {
      icon: "",
      titleEn: "",
      titleVi: "",
      descriptionEn: "",
      descriptionVi: "",
      order: 0,
    },
  });

  const showcaseServiceForm = useForm<InsertAboutShowcaseService>({
    resolver: zodResolver(insertAboutShowcaseServiceSchema),
    defaultValues: {
      titleEn: "",
      titleVi: "",
      descriptionEn: "",
      descriptionVi: "",
      order: 0,
    },
  });

  const processStepForm = useForm<InsertAboutProcessStep>({
    resolver: zodResolver(insertAboutProcessStepSchema),
    defaultValues: {
      stepNumber: "",
      titleEn: "",
      titleVi: "",
      descriptionEn: "",
      descriptionVi: "",
      order: 0,
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-sans font-light">About Page Content Management</h2>
      
      {/* Hero & General Content */}
      <Form {...aboutContentForm}>
        <form onSubmit={aboutContentForm.handleSubmit(onAboutContentSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section & Page Titles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Hero Section</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Hero Title (EN)</label>
                        <Input {...aboutContentForm.register("heroTitleEn")} placeholder="ARCHITECTURAL & INTERIOR DESIGN" data-testid="input-hero-title-en" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Hero Subtitle (EN)</label>
                        <Input {...aboutContentForm.register("heroSubtitleEn")} placeholder="INNOVATION IN EVERY PROJECT" data-testid="input-hero-subtitle-en" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Hero Title (VI)</label>
                        <Input {...aboutContentForm.register("heroTitleVi")} placeholder="THIẾT KẾ KIẾN TRÚC VÀ NỘI THẤT" data-testid="input-hero-title-vi" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Hero Subtitle (VI)</label>
                        <Input {...aboutContentForm.register("heroSubtitleVi")} placeholder="ĐỔI MỚI TRONG MỌI DỰ ÁN" data-testid="input-hero-subtitle-vi" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Principles Section Title */}
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Principles Section</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Principles Title (EN)</label>
                      <Input {...aboutContentForm.register("principlesTitleEn")} placeholder="THE FOUNDATION OF OUR WORK" data-testid="input-principles-title-en" />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Principles Title (VI)</label>
                      <Input {...aboutContentForm.register("principlesTitleVi")} placeholder="NỀN TẢNG CỦA CÔNG VIỆC CHÚNG TÔI" data-testid="input-principles-title-vi" />
                    </div>
                  </div>
                </div>

                {/* Process Section Title */}
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Process Section</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Process Title (EN)</label>
                      <Input {...aboutContentForm.register("processTitleEn")} placeholder="FROM CONCEPT TO REALITY" data-testid="input-process-title-en" />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Process Title (VI)</label>
                      <Input {...aboutContentForm.register("processTitleVi")} placeholder="TỪ Ý TƯỞNG ĐẾN HIỆN THỰC" data-testid="input-process-title-vi" />
                    </div>
                  </div>
                </div>

                {/* Company History Section */}
                <div className="p-4 border-t">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Company History (Lịch sử hình thành)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Section Title (EN)</label>
                        <Input {...aboutContentForm.register("historyTitleEn")} placeholder="OUR STORY" data-testid="input-history-title-en" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Section Title (VI)</label>
                        <Input {...aboutContentForm.register("historyTitleVi")} placeholder="CÂU CHUYỆN CỦA CHÚNG TÔI" data-testid="input-history-title-vi" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Content (EN)</label>
                        <Textarea {...aboutContentForm.register("historyContentEn")} rows={5} placeholder="Company history in English..." data-testid="textarea-history-content-en" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Content (VI)</label>
                        <Textarea {...aboutContentForm.register("historyContentVi")} rows={5} placeholder="Lịch sử công ty..." data-testid="textarea-history-content-vi" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Section */}
                <div className="p-4 border-t">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Mission (Sứ mệnh)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Section Title (EN)</label>
                        <Input {...aboutContentForm.register("missionTitleEn")} placeholder="OUR MISSION" data-testid="input-mission-title-en" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Section Title (VI)</label>
                        <Input {...aboutContentForm.register("missionTitleVi")} placeholder="SỨ MỆNH" data-testid="input-mission-title-vi" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Content (EN)</label>
                        <Textarea {...aboutContentForm.register("missionContentEn")} rows={4} placeholder="Our mission in English..." data-testid="textarea-mission-content-en" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Content (VI)</label>
                        <Textarea {...aboutContentForm.register("missionContentVi")} rows={4} placeholder="Sứ mệnh của chúng tôi..." data-testid="textarea-mission-content-vi" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vision Section */}
                <div className="p-4 border-t">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Vision (Tầm nhìn)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Section Title (EN)</label>
                        <Input {...aboutContentForm.register("visionTitleEn")} placeholder="OUR VISION" data-testid="input-vision-title-en" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Section Title (VI)</label>
                        <Input {...aboutContentForm.register("visionTitleVi")} placeholder="TẦM NHÌN" data-testid="input-vision-title-vi" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-light mb-2 block">Content (EN)</label>
                        <Textarea {...aboutContentForm.register("visionContentEn")} rows={4} placeholder="Our vision in English..." data-testid="textarea-vision-content-en" />
                      </div>
                      <div>
                        <label className="text-sm font-light mb-2 block">Content (VI)</label>
                        <Textarea {...aboutContentForm.register("visionContentVi")} rows={4} placeholder="Tầm nhìn của chúng tôi..." data-testid="textarea-vision-content-vi" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Values Section Title */}
                <div className="p-4 border-t">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Core Values Section Title</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Section Title (EN)</label>
                      <Input {...aboutContentForm.register("coreValuesTitleEn")} placeholder="CORE VALUES" data-testid="input-core-values-title-en" />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Section Title (VI)</label>
                      <Input {...aboutContentForm.register("coreValuesTitleVi")} placeholder="GIÁ TRỊ CỐT LÕI" data-testid="input-core-values-title-vi" />
                    </div>
                  </div>
                </div>

                {/* Team Section Title */}
                <div className="p-4 border-t">
                  <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Team Section Title</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-light mb-2 block">Section Title (EN)</label>
                      <Input {...aboutContentForm.register("teamTitleEn")} placeholder="OUR TEAM" data-testid="input-team-title-en" />
                    </div>
                    <div>
                      <label className="text-sm font-light mb-2 block">Section Title (VI)</label>
                      <Input {...aboutContentForm.register("teamTitleVi")} placeholder="ĐỘI NGŨ" data-testid="input-team-title-vi" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Projects Stat */}
                <div className="space-y-4 p-4">
                  <h4 className="text-sm font-medium uppercase tracking-wider">Projects</h4>
                  <Input {...aboutContentForm.register("statsProjectsValue")} placeholder="150+" data-testid="input-stats-projects-value" />
                  <Input {...aboutContentForm.register("statsProjectsLabelEn")} placeholder="Projects Completed (EN)" data-testid="input-stats-projects-label-en" />
                  <Input {...aboutContentForm.register("statsProjectsLabelVi")} placeholder="Dự án hoàn thành (VI)" data-testid="input-stats-projects-label-vi" />
                </div>

                {/* Awards Stat */}
                <div className="space-y-4 p-4">
                  <h4 className="text-sm font-medium uppercase tracking-wider">Awards</h4>
                  <Input {...aboutContentForm.register("statsAwardsValue")} placeholder="25+" data-testid="input-stats-awards-value" />
                  <Input {...aboutContentForm.register("statsAwardsLabelEn")} placeholder="Design Awards (EN)" data-testid="input-stats-awards-label-en" />
                  <Input {...aboutContentForm.register("statsAwardsLabelVi")} placeholder="Giải thưởng thiết kế (VI)" data-testid="input-stats-awards-label-vi" />
                </div>

                {/* Clients Stat */}
                <div className="space-y-4 p-4">
                  <h4 className="text-sm font-medium uppercase tracking-wider">Clients</h4>
                  <Input {...aboutContentForm.register("statsClientsValue")} placeholder="200+" data-testid="input-stats-clients-value" />
                  <Input {...aboutContentForm.register("statsClientsLabelEn")} placeholder="Happy Clients (EN)" data-testid="input-stats-clients-label-en" />
                  <Input {...aboutContentForm.register("statsClientsLabelVi")} placeholder="Khách hàng hài lòng (VI)" data-testid="input-stats-clients-label-vi" />
                </div>

                {/* Countries Stat */}
                <div className="space-y-4 p-4">
                  <h4 className="text-sm font-medium uppercase tracking-wider">Countries</h4>
                  <Input {...aboutContentForm.register("statsCountriesValue")} placeholder="12+" data-testid="input-stats-countries-value" />
                  <Input {...aboutContentForm.register("statsCountriesLabelEn")} placeholder="Countries (EN)" data-testid="input-stats-countries-label-en" />
                  <Input {...aboutContentForm.register("statsCountriesLabelVi")} placeholder="Quốc gia (VI)" data-testid="input-stats-countries-label-vi" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Showcase Banner Image */}
          <Card>
            <CardHeader>
              <CardTitle>Showcase Banner Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="relative">
                  {(showcaseBannerPreview || aboutContent?.showcaseBannerImage) ? (
                    <div className="relative group">
                      <div className="border bg-muted overflow-hidden">
                        <img 
                          src={showcaseBannerPreview || aboutContent?.showcaseBannerImage || ''} 
                          alt="Showcase Banner Preview" 
                          className="w-full aspect-[16/7] object-cover" 
                        />
                      </div>
                      <label 
                        htmlFor="showcase-banner-upload" 
                        className="absolute top-4 right-4 bg-white text-black px-4 py-2 cursor-pointer hover:bg-white/90 transition-all shadow-lg flex items-center gap-2 group-hover:scale-105"
                        data-testid="button-change-showcase-banner"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="text-sm font-medium">Change Image</span>
                      </label>
                      <input
                        id="showcase-banner-upload"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleShowcaseBannerFileChange}
                        className="hidden"
                        data-testid="input-showcase-banner-file"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 p-12 text-center">
                      <label htmlFor="showcase-banner-upload-initial" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 rounded-full bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Upload Banner Image</p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG • Max 10MB • Recommended: 1920x800px
                            </p>
                          </div>
                          <Button type="button" variant="outline" className="bg-white text-black hover:bg-white/90">
                            Choose File
                          </Button>
                        </div>
                      </label>
                      <input
                        id="showcase-banner-upload-initial"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleShowcaseBannerFileChange}
                        className="hidden"
                        data-testid="input-showcase-banner-file-initial"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Format: PNG, JPG • Max: 10MB • Recommended: 1920x800px
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className={`px-8 transition-all ${!aboutContentForm.formState.isDirty && !showcaseBannerFile ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:opacity-90'}`}
              disabled={(!aboutContentForm.formState.isDirty && !showcaseBannerFile) || updateAboutContentMutation.isPending}
              data-testid="button-save-about-content"
            >
              {updateAboutContentMutation.isPending ? "Saving..." : "Save About Content"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Principles Management */}
      <Card>
        <CardHeader>
          <CardTitle>Principles (3 Items - Fixed)</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isPrincipleDialogOpen} onOpenChange={setIsPrincipleDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Principle</DialogTitle>
              </DialogHeader>
                <Form {...principleForm}>
                  <form onSubmit={principleForm.handleSubmit(onPrincipleSubmit)} className="space-y-4">
                    <FormField
                      control={principleForm.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon (Lucide name)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Zap, Award, Users" data-testid="input-principle-icon" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={principleForm.control}
                        name="titleEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (EN)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-principle-title-en" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={principleForm.control}
                        name="titleVi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (VI)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-principle-title-vi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={principleForm.control}
                        name="descriptionEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (EN)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} data-testid="textarea-principle-description-en" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={principleForm.control}
                        name="descriptionVi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (VI)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} data-testid="textarea-principle-description-vi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={principleForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} data-testid="input-principle-order" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" data-testid="button-submit-principle">
                      Update Principle
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          {aboutPrinciplesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Title (EN)</TableHead>
                  <TableHead>Title (VI)</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aboutPrinciples.map((principle) => (
                  <TableRow key={principle.id}>
                    <TableCell>{principle.icon}</TableCell>
                    <TableCell>{principle.titleEn}</TableCell>
                    <TableCell>{principle.titleVi}</TableCell>
                    <TableCell>{principle.order}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPrinciple(principle);
                          principleForm.reset(principle);
                          setIsPrincipleDialogOpen(true);
                        }}
                        data-testid={`button-edit-principle-${principle.id}`}
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

      {/* Showcase Services Management */}
      <Card>
        <CardHeader>
          <CardTitle>Showcase Services (4 Items - Fixed)</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isShowcaseServiceDialogOpen} onOpenChange={setIsShowcaseServiceDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Showcase Service</DialogTitle>
              </DialogHeader>
              <Form {...showcaseServiceForm}>
                <form onSubmit={showcaseServiceForm.handleSubmit(onShowcaseServiceSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={showcaseServiceForm.control}
                      name="titleEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (EN)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-showcase-title-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={showcaseServiceForm.control}
                      name="titleVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (VI)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-showcase-title-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={showcaseServiceForm.control}
                      name="descriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (EN)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="textarea-showcase-description-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={showcaseServiceForm.control}
                      name="descriptionVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (VI)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="textarea-showcase-description-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={showcaseServiceForm.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} data-testid="input-showcase-order" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" data-testid="button-submit-showcase">
                    Update Showcase Service
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {aboutShowcaseServicesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title (EN)</TableHead>
                  <TableHead>Title (VI)</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aboutShowcaseServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.titleEn}</TableCell>
                    <TableCell>{service.titleVi}</TableCell>
                    <TableCell>{service.order}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingShowcaseService(service);
                          showcaseServiceForm.reset(service);
                          setIsShowcaseServiceDialogOpen(true);
                        }}
                        data-testid={`button-edit-showcase-${service.id}`}
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

      {/* Process Steps Management */}
      <Card>
        <CardHeader>
          <CardTitle>Process Steps (4 Items - Fixed)</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isProcessStepDialogOpen} onOpenChange={setIsProcessStepDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Process Step</DialogTitle>
              </DialogHeader>
              <Form {...processStepForm}>
                <form onSubmit={processStepForm.handleSubmit(onProcessStepSubmit)} className="space-y-4">
                  <FormField
                    control={processStepForm.control}
                    name="stepNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} data-testid="input-step-number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={processStepForm.control}
                      name="titleEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (EN)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-step-title-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={processStepForm.control}
                      name="titleVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (VI)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-step-title-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={processStepForm.control}
                      name="descriptionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (EN)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="textarea-step-description-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={processStepForm.control}
                      name="descriptionVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (VI)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="textarea-step-description-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-step">
                    Update Process Step
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {aboutProcessStepsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Title (EN)</TableHead>
                  <TableHead>Title (VI)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aboutProcessSteps.map((step) => (
                  <TableRow key={step.id}>
                    <TableCell>{step.stepNumber}</TableCell>
                    <TableCell>{step.titleEn}</TableCell>
                    <TableCell>{step.titleVi}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProcessStep(step);
                          processStepForm.reset(step);
                          setIsProcessStepDialogOpen(true);
                        }}
                        data-testid={`button-edit-step-${step.id}`}
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

      {/* Team Members Management */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isTeamMemberDialogOpen} onOpenChange={setIsTeamMemberDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTeamMember ? 'Edit' : 'Add'} Team Member</DialogTitle>
              </DialogHeader>
              <Form {...teamMemberForm}>
                <form onSubmit={teamMemberForm.handleSubmit(onTeamMemberSubmit)} className="space-y-4">
                  <FormField
                    control={teamMemberForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sarah Chen" data-testid="input-team-member-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={teamMemberForm.control}
                      name="positionEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position (EN)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Lead Designer" data-testid="input-team-member-position-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamMemberForm.control}
                      name="positionVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position (VI)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Trưởng phòng thiết kế" data-testid="input-team-member-position-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={teamMemberForm.control}
                      name="bioEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio (EN)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Professional background..." data-testid="textarea-team-member-bio-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamMemberForm.control}
                      name="bioVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio (VI)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Lý lịch chuyên môn..." data-testid="textarea-team-member-bio-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={teamMemberForm.control}
                      name="achievementsEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Achievements (EN)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Awards and accomplishments..." data-testid="textarea-team-member-achievements-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamMemberForm.control}
                      name="achievementsVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Achievements (VI)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Giải thưởng và thành tựu..." data-testid="textarea-team-member-achievements-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={teamMemberForm.control}
                      name="philosophyEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Philosophy (EN)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Design philosophy..." data-testid="textarea-team-member-philosophy-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teamMemberForm.control}
                      name="philosophyVi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Philosophy (VI)</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Triết lý thiết kế..." data-testid="textarea-team-member-philosophy-vi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={teamMemberForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image (Max 10MB)</FormLabel>
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
                    control={teamMemberForm.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} data-testid="input-team-member-order" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" data-testid="button-submit-team-member">
                    {editingTeamMember ? 'Update' : 'Add'} Team Member
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <div className="mb-4">
            <Button 
              onClick={() => {
                setEditingTeamMember(null);
                teamMemberForm.reset({
                  name: "",
                  positionEn: "",
                  positionVi: "",
                  bioEn: "",
                  bioVi: "",
                  achievementsEn: "",
                  achievementsVi: "",
                  philosophyEn: "",
                  philosophyVi: "",
                  image: "",
                  order: 0,
                });
                setIsTeamMemberDialogOpen(true);
              }}
              data-testid="button-add-team-member"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {aboutTeamMembersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position (EN)</TableHead>
                  <TableHead>Position (VI)</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aboutTeamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.positionEn}</TableCell>
                    <TableCell>{member.positionVi}</TableCell>
                    <TableCell>{member.order}</TableCell>
                    <TableCell>
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="h-12 w-12 rounded object-cover"
                          data-testid={`img-team-member-${member.id}`}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTeamMember(member);
                          teamMemberForm.reset(member);
                          setIsTeamMemberDialogOpen(true);
                        }}
                        data-testid={`button-edit-team-member-${member.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" data-testid={`button-delete-team-member-${member.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {member.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTeamMemberMutation.mutate(member.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
