
export interface ApiConfig {
  baseUrl: string;
  websocketUrl: string;
}

// Default configuration - users can override these
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  websocketUrl: process.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001'
};

class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  // Generic fetch wrapper
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Website endpoints
  async getWebsites() {
    return this.fetchApi('/websites');
  }

  async getWebsite(id: string) {
    return this.fetchApi(`/websites/${id}`);
  }

  async createWebsite(website: any) {
    return this.fetchApi('/websites', {
      method: 'POST',
      body: JSON.stringify(website),
    });
  }

  async updateWebsite(id: string, updates: any) {
    return this.fetchApi(`/websites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteWebsite(id: string) {
    return this.fetchApi(`/websites/${id}`, {
      method: 'DELETE',
    });
  }

  // Comment endpoints
  async getComments(websiteId: string) {
    return this.fetchApi(`/websites/${websiteId}/comments`);
  }

  async createComment(websiteId: string, comment: any) {
    return this.fetchApi(`/websites/${websiteId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  // Thread endpoints
  async getThreads(websiteId: string) {
    return this.fetchApi(`/websites/${websiteId}/threads`);
  }

  async createThread(websiteId: string, thread: any) {
    return this.fetchApi(`/websites/${websiteId}/threads`, {
      method: 'POST',
      body: JSON.stringify(thread),
    });
  }

  async updateThread(threadId: string, updates: any) {
    return this.fetchApi(`/threads/${threadId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Get WebSocket URL
  getWebSocketUrl(): string {
    return this.config.websocketUrl;
  }

  // Update configuration
  updateConfig(newConfig: Partial<ApiConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export const apiService = new ApiService();
