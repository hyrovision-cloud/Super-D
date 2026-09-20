export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    requestId?: string;
    totalItems?: number;
    page?: number;
    pageSize?: number;
    [key: string]: any;
  };
}

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Array<{ field: string; message: string }>;
  requestId?: string;
}

class HttpClient {
  private baseUrl = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '/api/v1';

  private getAuthToken(): string | null {
    return localStorage.getItem('aarogya_access_token');
  }

  private getBranchContext(): string | null {
    return (
      localStorage.getItem('aarogya_selected_branch') ||
      localStorage.getItem('aarogya_demo_selected_branch')
    );
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getAuthToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const branch = this.getBranchContext();
    if (branch && branch !== 'all' && !headers['X-Branch-Context']) {
      headers['X-Branch-Context'] = branch;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let json: any = null;
    try {
      json = await response.json();
    } catch {
      // Non-json response
    }

    if (!response.ok) {
      const error: ApiError = json?.error || {
        code: `HTTP_${response.status}`,
        message: response.statusText || 'An error occurred during network request.',
      };
      throw error;
    }

    return (json?.data !== undefined ? json.data : json) as T;
  }

  get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
