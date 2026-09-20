import { httpClient } from './httpClient';

export interface OwnerAiInsight {
  title: string;
  severity: 'positive' | 'neutral' | 'warning' | 'critical';
  message: string;
}

export interface OwnerAiChart {
  type: 'line' | 'bar' | 'doughnut';
  title: string;
  data: Array<{ label: string; value: number }>;
}

export interface OwnerAiSource {
  tool: string;
  filters: Record<string, any>;
}

export interface OwnerAiResponse {
  answer: string;
  summary: {
    period: string;
    branchScope: string;
  };
  insights: OwnerAiInsight[];
  recommendedActions: string[];
  charts: OwnerAiChart[];
  sources: OwnerAiSource[];
}

export const ownerIntelligenceApi = {
  async queryIntelligence(query: string, filters?: { branchId?: string; dateFrom?: string; dateTo?: string }): Promise<OwnerAiResponse> {
    return httpClient.post<OwnerAiResponse>('/owner/intelligence/query', {
      query,
      ...filters,
    });
  },

  async getExecutiveBrief(): Promise<any> {
    return httpClient.get<any>('/owner/intelligence/brief');
  },

  async getQueryHistory(): Promise<any[]> {
    return httpClient.get<any[]>('/owner/intelligence/history');
  },
};
