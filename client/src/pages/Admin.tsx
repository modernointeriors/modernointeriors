import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, BarChart3, Briefcase, Users, Mail, Newspaper, Edit3, Home, Image } from "lucide-react";
import AdminDashboard from "@/components/AdminDashboard";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

function getTabs(t: (key: string) => string) {
  return [
    { id: 'overview', label: t('admin.overview'), icon: BarChart3 },
    { id: 'projects', label: t('admin.projects'), icon: Briefcase },
    { id: 'clients', label: t('admin.crm'), icon: Users },
    { id: 'inquiries', label: t('admin.inquiries'), icon: Mail },
    { id: 'articles', label: t('admin.articles'), icon: Newspaper },
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'about', label: 'About', icon: Image },
    { id: 'content', label: t('admin.content'), icon: Edit3 }
  ];
}

export default function Admin() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const tabs = getTabs(t);

  const handleLogout = () => {
    logout();
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã được đăng xuất khỏi hệ thống.",
    });
    // Redirect to home page after logout
    navigate('/');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black -ml-16">
        <div className="w-full mx-auto py-24">
          {/* Header Section with Glass Morphism */}
          <div className="mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-xl rounded-none"></div>
              <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-none p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <h1 className="text-4xl font-light text-white tracking-wider" data-testid="heading-admin">
                        {t('admin.dashboard').toUpperCase()}
                      </h1>
                    </div>
                    <p className="text-gray-400 font-light tracking-wide">
                      {t('admin.manage')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-none backdrop-blur-sm">
                      <User className="h-4 w-4 text-white/70" />
                      <span className="text-sm text-white font-light" data-testid="text-current-user">
                        {user?.username || 'Admin'}
                      </span>
                    </div>
                    <Button 
                      onClick={handleLogout}
                      className="bg-transparent border border-white/30 text-white hover:border-white hover:bg-white/10 px-4 py-2 font-light tracking-wide transition-all duration-300 ease-in-out rounded-none"
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('admin.logout')}
                    </Button>
                    <div className="px-3 py-1 bg-white/10 border border-white/20 rounded-none backdrop-blur-sm">
                      <span className="text-xs text-white/80 font-light tracking-wide">{t('admin.access')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs with Modern Design */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/3 to-white/1 backdrop-blur-xl rounded-none"></div>
              <div className="relative bg-black/30 backdrop-blur-md border border-white/10 rounded-none p-6">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <Button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-light tracking-wide transition-all duration-300 ease-in-out rounded-none ${
                          isActive 
                            ? 'bg-white/20 border border-white/30 text-white backdrop-blur-sm' 
                            : 'bg-transparent border border-white/30 text-white/70 hover:bg-white/10 hover:text-white hover:border-white'
                        }`}
                        data-testid={`tab-${tab.id}`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content with Glass Effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-white/1 backdrop-blur-xl rounded-none"></div>
            <div className="relative bg-black/30 backdrop-blur-md border border-white/10 rounded-none overflow-hidden">
              <AdminDashboard activeTab={activeTab} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
