const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'worker';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'worker';
  };
  error?: string;
}

export interface Animal {
  _id?: string;
  tagNumber: string;
  name: string;
  type: 'cattle' | 'sheep' | 'goat' | 'pig' | 'chicken' | 'other';
  breed: string;
  weight: number;
  dateOfBirth?: string;
  gender: 'male' | 'female';
  status: 'healthy' | 'sick' | 'quarantine' | 'sold' | 'deceased';
  notes?: string;
  farmId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AnimalStats {
  total: number;
  healthy: number;
  sick: number;
  quarantine: number;
  healthRate: number;
  byType: Record<string, number>;
  lastUpdated: string;
}

export interface Task {
  _id?: string;
  farm: string;
  title: string;
  description: string;
  category: 'feeding' | 'cleaning' | 'health' | 'maintenance' | 'harvest' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  dueDate: string;
  completedAt?: string;
  completedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
  };
  notes?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  type: 'animal_added' | 'animal_updated' | 'task_completed' | 'health_check' | 'weight_recorded' | 'farm_created' | 'user_joined';
  action: string;
  description: string;
  entityType: 'animal' | 'task' | 'farm' | 'user' | 'health' | 'weight';
  entityId: string;
  entityName?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  farm: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/me');
  }

  async createAnimal(animal: Omit<Animal, '_id'>): Promise<Animal> {
    const response = await this.request<{success: boolean; animal: Animal}>('/animals', {
      method: 'POST',
      body: JSON.stringify(animal),
    });
    return response.animal;
  }

  async getAnimals(farmId?: string): Promise<ApiResponse<Animal[]>> {
    const query = farmId ? `?farmId=${farmId}` : '';
    return this.request<ApiResponse<Animal[]>>(`/animals${query}`);
  }

  async getAnimalById(id: string): Promise<ApiResponse<Animal>> {
    return this.request<ApiResponse<Animal>>(`/animals/${id}`);
  }

  async updateAnimal(id: string, animal: Partial<Animal>): Promise<ApiResponse<Animal>> {
    return this.request<ApiResponse<Animal>>(`/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(animal),
    });
  }

  async deleteAnimal(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/animals/${id}`, {
      method: 'DELETE',
    });
  }

  async getRecentActivities(farmId: string, limit: number = 10, offset: number = 0): Promise<{
    success: boolean;
    activities: Activity[];
    pagination: { total: number; limit: number; offset: number };
  }> {
    return this.request(`/activities/farms/${farmId}/activities?limit=${limit}&offset=${offset}`);
  }

  async getUserActivities(limit: number = 10, offset: number = 0): Promise<{
    success: boolean;
    activities: Activity[];
    pagination: { total: number; limit: number; offset: number };
  }> {
    return this.request(`/activities/user/activities?limit=${limit}&offset=${offset}`);
  }

  async getAnimalStats(farmId: string): Promise<{ success: boolean; stats: AnimalStats }> {
    return this.request(`/animals/farms/${farmId}/stats`);
  }

  async getTasks(farmId: string, filters?: {
    status?: string;
    category?: string;
    priority?: string;
    assignedTo?: string;
  }): Promise<{ success: boolean; count: number; data: Task[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/tasks/farms/${farmId}${query}`);
  }

  async getTodayTasks(farmId: string): Promise<{ success: boolean; count: number; data: Task[] }> {
    return this.request(`/tasks/farms/${farmId}/today`);
  }

  async createTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'completedBy' | 'completedAt'>): Promise<{ success: boolean; data: Task }> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<{ success: boolean; data: Task }> {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async completeTask(taskId: string): Promise<{ success: boolean; data: Task }> {
    return this.request(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  }

  async uncompleteTask(taskId: string): Promise<{ success: boolean; data: Task }> {
    return this.request(`/tasks/${taskId}/uncomplete`, {
      method: 'PATCH',
    });
  }

  async deleteTask(taskId: string): Promise<{ success: boolean }> {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async getTaskStats(farmId: string): Promise<{ 
    success: boolean; 
    stats: { 
      today: { 
        total: number; 
        completed: number; 
        pending: number; 
      } 
    } 
  }> {
    return this.request(`/tasks/farms/${farmId}/stats`);
  }
}

export const apiClient = new ApiClient();