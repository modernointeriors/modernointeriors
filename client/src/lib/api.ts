import { apiRequest } from "./queryClient";
import type { Project, Client, Inquiry, Service, InsertProject, InsertClient, InsertInquiry, InsertService } from "@shared/schema";

// Projects API
export const projectsApi = {
  getAll: async (filters?: { category?: string; featured?: boolean }): Promise<Project[]> => {
    const searchParams = new URLSearchParams();
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.featured !== undefined) searchParams.append('featured', filters.featured.toString());
    
    const url = `/api/projects${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    return response.json();
  },

  getById: async (id: string): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Project not found');
      }
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }
    
    return response.json();
  },

  create: async (project: InsertProject): Promise<Project> => {
    const response = await apiRequest('POST', '/api/projects', project);
    return response.json();
  },

  update: async (id: string, project: Partial<InsertProject>): Promise<Project> => {
    const response = await apiRequest('PUT', `/api/projects/${id}`, project);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest('DELETE', `/api/projects/${id}`);
  },
};

// Clients API
export const clientsApi = {
  getAll: async (status?: string): Promise<Client[]> => {
    const url = status ? `/api/clients?status=${status}` : '/api/clients';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }
    
    return response.json();
  },

  getById: async (id: string): Promise<Client> => {
    const response = await fetch(`/api/clients/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Client not found');
      }
      throw new Error(`Failed to fetch client: ${response.statusText}`);
    }
    
    return response.json();
  },

  create: async (client: InsertClient): Promise<Client> => {
    const response = await apiRequest('POST', '/api/clients', client);
    return response.json();
  },

  update: async (id: string, client: Partial<InsertClient>): Promise<Client> => {
    const response = await apiRequest('PUT', `/api/clients/${id}`, client);
    return response.json();
  },
};

// Inquiries API
export const inquiriesApi = {
  getAll: async (status?: string): Promise<Inquiry[]> => {
    const url = status ? `/api/inquiries?status=${status}` : '/api/inquiries';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch inquiries: ${response.statusText}`);
    }
    
    return response.json();
  },

  getById: async (id: string): Promise<Inquiry> => {
    const response = await fetch(`/api/inquiries/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Inquiry not found');
      }
      throw new Error(`Failed to fetch inquiry: ${response.statusText}`);
    }
    
    return response.json();
  },

  create: async (inquiry: InsertInquiry): Promise<Inquiry> => {
    const response = await apiRequest('POST', '/api/inquiries', inquiry);
    return response.json();
  },

  update: async (id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry> => {
    const response = await apiRequest('PUT', `/api/inquiries/${id}`, inquiry);
    return response.json();
  },
};

// Services API
export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await fetch('/api/services');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }
    
    return response.json();
  },

  getById: async (id: string): Promise<Service> => {
    const response = await fetch(`/api/services/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Service not found');
      }
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }
    
    return response.json();
  },

  create: async (service: InsertService): Promise<Service> => {
    const response = await apiRequest('POST', '/api/services', service);
    return response.json();
  },

  update: async (id: string, service: Partial<InsertService>): Promise<Service> => {
    const response = await apiRequest('PUT', `/api/services/${id}`, service);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest('DELETE', `/api/services/${id}`);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<{
    totalProjects: number;
    activeClients: number;
    newInquiries: number;
    revenue: string;
  }> => {
    const response = await fetch('/api/dashboard/stats');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Image Upload API (mock implementation)
export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    // In a real implementation, this would upload to a cloud storage service
    // For now, we'll simulate an upload and return a mock URL
    
    return new Promise((resolve, reject) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error('Invalid file type. Please upload an image file.'));
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        reject(new Error('File size too large. Please upload an image smaller than 10MB.'));
        return;
      }

      // Simulate upload delay
      setTimeout(() => {
        // Create a blob URL for preview
        const url = URL.createObjectURL(file);
        resolve(url);
      }, 1000);
    });
  },

  uploadMultiple: async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadApi.uploadImage(file));
    return Promise.all(uploadPromises);
  },
};

// Utility functions for common operations
export const apiUtils = {
  // Handle API errors consistently
  handleApiError: (error: any): string => {
    if (error.message) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred. Please try again.';
  },

  // Format dates consistently
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Format currency
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },

  // Debounce function for search inputs
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Generate SEO-friendly slugs
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Generate color classes based on status
  getStatusColor: (status: string): string => {
    const statusColors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      lead: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      reviewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      contacted: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      converted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    };
    
    return statusColors[status.toLowerCase()] || statusColors.new;
  },

  // Truncate text to specified length
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  },
};

// Export all APIs as a single object for convenience
export const api = {
  projects: projectsApi,
  clients: clientsApi,
  inquiries: inquiriesApi,
  services: servicesApi,
  dashboard: dashboardApi,
  upload: uploadApi,
  utils: apiUtils,
};

export default api;
