import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Portfolio from "@/pages/Portfolio";
import ProjectDetail from "@/pages/ProjectDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/*" >
        <Layout>
          <Switch>
            {/* Home routes */}
            <Route path="/" component={Home} />
            <Route path="/en" component={Home} />
            <Route path="/vn" component={Home} />
            
            {/* Page routes with language suffix */}
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/portfolio/en" component={Portfolio} />
            <Route path="/portfolio/vn" component={Portfolio} />
            
            <Route path="/about" component={About} />
            <Route path="/about/en" component={About} />
            <Route path="/about/vn" component={About} />
            
            <Route path="/contact" component={Contact} />
            <Route path="/contact/en" component={Contact} />
            <Route path="/contact/vn" component={Contact} />
            
            <Route path="/blog" component={Blog} />
            <Route path="/blog/en" component={Blog} />
            <Route path="/blog/vn" component={Blog} />
            
            <Route path="/services" component={Services} />
            <Route path="/services/en" component={Services} />
            <Route path="/services/vn" component={Services} />
            
            {/* Special routes */}
            <Route path="/project/:id" component={ProjectDetail} />
            <Route path="/blog/:slug" component={BlogDetail} />
            
            <Route path="/admin">
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            </Route>
            
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <div className="dark min-h-screen bg-background text-foreground">
              <Toaster />
              <Router />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
