import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest, getQueryFn } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [manualUser, setManualUser] = useState<User | null>(null);
  const wasAuthenticatedRef = useRef(false);

  // Check if user is authenticated on app load, re-check every 5 minutes
  const { data: userData, isPending, isFetching } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchInterval: 5 * 60 * 1000, // check every 5 minutes
    refetchIntervalInBackground: false,
  });

  // Use userData from query as primary, manualUser as fallback (for login mutation)
  const user = userData ?? manualUser;
  // isLoading when pending (first fetch) or fetching (refetch) 
  const isLoading = isPending || isFetching;

  // Detect session expiry: was authenticated, now no longer
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        wasAuthenticatedRef.current = true;
      } else if (wasAuthenticatedRef.current) {
        // Session expired — set flag and redirect to login
        wasAuthenticatedRef.current = false;
        sessionStorage.setItem('session_expired', '1');
      }
    }
  }, [user, isLoading]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return await response.json();
    },
    onSuccess: (data: User) => {
      setManualUser(data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout');
      return await response.json();
    },
    onSuccess: () => {
      setManualUser(null);
      queryClient.clear();
    },
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ username, password });
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}