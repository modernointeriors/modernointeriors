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
                {/* Logo */}
                <div className="mx-auto mb-8">
                  <img 
                    src="/attached_assets/logo.white.png" 
                    alt="MODERNO INTERIORS" 
                    className="h-16 w-auto mx-auto opacity-90"
                  />
                </div>
                
                {/* Clean typography */}
                <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white font-light" data-testid="label-username">
                      Tên đăng nhập
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập"
                      disabled={isLoading}
                      autoComplete="username"
                      className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                      data-testid="input-username"
                    />
                  </div>
                  
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-light" data-testid="label-password">
                      Mật khẩu
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-4 pr-10 text-white placeholder-gray-400 focus:border-white focus-visible:ring-0"
                        data-testid="input-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
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
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full bg-transparent border border-white/20 text-white hover:bg-yellow-500/90 hover:text-black hover:border-yellow-500/90 py-4 font-light tracking-widest uppercase transition-all duration-300"
                      disabled={isLoading}
                      data-testid="button-login"
                    >
                      {isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
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