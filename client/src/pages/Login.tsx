import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin đăng nhập.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
        });
        // Add a small delay to ensure auth context is updated
        setTimeout(() => {
          navigate('/admin');
        }, 100);
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Tên đăng nhập hoặc mật khẩu không đúng.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black flex items-center justify-center py-24">
        <div className="w-full max-w-lg p-6">
          {/* Glass morphism card with subtle backdrop */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-2xl"></div>
            <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Header Section */}
              <div className="px-8 pt-12 pb-8 text-center">
                {/* Minimalist icon */}
                <div className="mx-auto w-12 h-12 mb-8 relative">
                  <div className="w-full h-full border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Lock className="w-5 h-5 text-white/80" />
                  </div>
                </div>
                
                {/* Clean typography */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-light text-white tracking-[0.2em] mb-2">
                    MODERNO
                  </h1>
                  <div className="w-12 h-px bg-white/20 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-400 font-light tracking-wide">
                    Administration Access
                  </p>
                </div>
              </div>
              
              {/* Form Section */}
              <div className="px-8 pb-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Username Field */}
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-white/70 text-sm font-light tracking-wide" data-testid="label-username">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      disabled={isLoading}
                      autoComplete="username"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:border-white/30 focus:bg-white/10 focus-visible:ring-0 transition-all duration-300 backdrop-blur-sm"
                      data-testid="input-username"
                    />
                  </div>
                  
                  {/* Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-white/70 text-sm font-light tracking-wide" data-testid="label-password">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-4 pr-12 text-white placeholder-gray-500 focus:border-white/30 focus:bg-white/10 focus-visible:ring-0 transition-all duration-300 backdrop-blur-sm"
                        data-testid="input-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 hover:bg-white/10 text-gray-400 hover:text-white transition-colors rounded-md"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-transparent border border-white/20 text-white hover:bg-yellow-500/90 hover:text-black hover:border-yellow-500/90 py-4 font-light tracking-widest uppercase transition-all duration-300 backdrop-blur-sm"
                      disabled={isLoading}
                      data-testid="button-login"
                    >
                      {isLoading ? "Authenticating..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}