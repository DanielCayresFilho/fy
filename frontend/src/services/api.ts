import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:8000/api';

// Criar instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Tipos
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface MonthMovimentation {
  id: number;
  user_id: number;
  month: number;
  year: number;
  account_type: 'fix' | 'variable' | 'credit';
  account_id: number;
  account_name: string;
  amount: number;
  status: 'paid' | 'pending' | 'late';
  payment_date: string | null;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface MovimentationSummary {
  month: number;
  year: number;
  summary: {
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    late_amount: number;
  };
  count: {
    total: number;
    paid: number;
    pending: number;
    late: number;
  };
}

export interface Balance {
  total_income: number;
  total_expenses: number;
  balance: number;
  paid_expenses: number;
  pending_expenses: number;
  late_expenses: number;
}

// Serviços de Autenticação
export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post('/auth/refresh');
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
};

// Serviços de Movimentação Mensal
export const movimentationService = {
  // Listar movimentações do mês
  list: async (month?: number, year?: number): Promise<MonthMovimentation[]> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await api.get(`/month-movimentations?${params.toString()}`);
    return response.data.data || [];
  },

  // Gerar movimentações do mês
  generateMonth: async (month?: number, year?: number) => {
    const response = await api.post('/month-movimentations/generate', {
      month,
      year,
    });
    return response.data;
  },

  // Marcar como pago
  markAsPaid: async (id: number, paymentDate?: string) => {
    const response = await api.post(`/month-movimentations/${id}/pay`, {
      payment_date: paymentDate,
    });
    return response.data;
  },

  // Atualizar contas atrasadas
  updateLate: async (month?: number, year?: number) => {
    const response = await api.post('/month-movimentations/update-late', {
      month,
      year,
    });
    return response.data;
  },

  // Resumo do mês
  summary: async (month?: number, year?: number): Promise<MovimentationSummary> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await api.get(`/month-movimentations/summary?${params.toString()}`);
    return response.data.data;
  },
};

// Serviços de Dashboard
export const dashboardService = {
  getBalance: async (month?: number, year?: number): Promise<Balance> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await api.get(`/dashboard/balance?${params.toString()}`);
    return response.data.data;
  },
};

// Função para obter token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Função para obter usuário
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Função para verificar se está autenticado
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export default api;

