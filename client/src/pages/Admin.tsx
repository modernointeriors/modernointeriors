import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User } from "lucide-react";
import AdminDashboard from "@/components/AdminDashboard";

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
  { id: 'projects', label: 'Projects', icon: 'fas fa-briefcase' },
  { id: 'clients', label: 'CRM', icon: 'fas fa-users' },
  { id: 'inquiries', label: 'Inquiries', icon: 'fas fa-envelope' },
  { id: 'articles', label: 'Articles', icon: 'fas fa-newspaper' },
  { id: 'content', label: 'Content', icon: 'fas fa-edit' }
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

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
    <div className="min-h-screen pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-sans font-light mb-2" data-testid="heading-admin">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your projects, clients, and website content
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span data-testid="text-current-user">
                  {user?.username || 'Admin'}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                Admin Access
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2"
                  data-testid={`tab-${tab.id}`}
                >
                  <i className={`${tab.icon} mr-2`} />
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Content */}
        <AdminDashboard activeTab={activeTab} />
      </div>
    </div>
  );
}
