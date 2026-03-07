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
            <Route path="/" component={Home} />

            {/* Portfolio — EN + VI */}
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/portfolio/:slug" component={ProjectDetail} />
            <Route path="/du-an" component={Portfolio} />
            <Route path="/du-an/:slug" component={ProjectDetail} />

            {/* Blog — EN + VI */}
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogDetail} />
            <Route path="/tin-tuc" component={Blog} />
            <Route path="/tin-tuc/:slug" component={BlogDetail} />

            {/* About — EN + VI */}
            <Route path="/about" component={About} />
            <Route path="/gioi-thieu" component={About} />

            {/* Contact — EN + VI */}
            <Route path="/contact" component={Contact} />
            <Route path="/lien-he" component={Contact} />

            {/* Legacy project ID route */}
            <Route path="/project/:id" component={ProjectDetail} />

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
