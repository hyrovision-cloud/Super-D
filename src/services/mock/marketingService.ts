import { Campaign, DigitalContent, Lead } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export interface MarketingMetrics {
  totalSpend: number;
  totalBudget: number;
  totalLeads: number;
  totalEnquiries: number;
  averageConversionRate: number;
  averageCostPerLead: number;
}

export const marketingService = {
  async getCampaigns(branchId?: string): Promise<Campaign[]> {
    let campaigns = [...mockStore.getState().campaigns];
    if (branchId && branchId !== 'all') {
      campaigns = campaigns.filter((c) => c.branchId === branchId);
    }
    return simulateDelay(campaigns);
  },

  async getDigitalContent(branchId?: string): Promise<DigitalContent[]> {
    let content = [...mockStore.getState().digitalContent];
    if (branchId && branchId !== 'all') {
      content = content.filter((c) => c.branchId === branchId);
    }
    return simulateDelay(content);
  },

  async getLeads(branchId?: string): Promise<Lead[]> {
    let leads = [...mockStore.getState().leads];
    if (branchId && branchId !== 'all') {
      leads = leads.filter((l) => l.branchId === branchId);
    }
    return simulateDelay(leads);
  },

  async getMarketingMetrics(branchId?: string): Promise<MarketingMetrics> {
    let campaigns = [...mockStore.getState().campaigns];
    if (branchId && branchId !== 'all') {
      campaigns = campaigns.filter((c) => c.branchId === branchId);
    }

    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsCount, 0);
    const totalEnquiries = campaigns.reduce((sum, c) => sum + c.enquiriesCount, 0);

    const averageCostPerLead = totalLeads > 0 ? Math.round((totalSpend / totalLeads) * 100) / 100 : 0;
    const averageConversionRate =
      totalLeads > 0 ? Math.round((totalEnquiries / totalLeads) * 1000) / 10 : 0;

    return simulateDelay({
      totalSpend,
      totalBudget,
      totalLeads,
      totalEnquiries,
      averageConversionRate,
      averageCostPerLead,
    });
  },
};
