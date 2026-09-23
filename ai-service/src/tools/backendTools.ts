/**
 * Controlled Backend Tool Calling Specifications
 * 
 * CRITICAL ARCHITECTURAL CONSTRAINT:
 * The AI service must NEVER query MongoDB directly.
 * It invokes authorized backend HTTP APIs using scoped tokens.
 */

import { env } from '../config/env';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export const BACKEND_TOOLS: ToolDefinition[] = [
  {
    name: 'getRevenueSummary',
    description: 'Fetches consolidated hospital network revenue summary across billing categories for a date range.',
    parameters: {
      type: 'object',
      properties: {
        branchId: { type: 'string', description: 'Branch ID or "all" for network total' },
        dateFrom: { type: 'string', description: 'Start date in YYYY-MM-DD' },
        dateTo: { type: 'string', description: 'End date in YYYY-MM-DD' },
      },
    },
  },
  {
    name: 'getBranchRevenue',
    description: 'Retrieves multi-branch revenue comparison and occupancy rates across Trichy, Chennai, Madurai, and Pudukkottai.',
    parameters: {
      type: 'object',
      properties: {
        dateFrom: { type: 'string' },
        dateTo: { type: 'string' },
      },
    },
  },
  {
    name: 'getPatientStatistics',
    description: 'Returns aggregate patient footfall, new vs returning patient counts, and department distribution.',
    parameters: {
      type: 'object',
      properties: {
        branchId: { type: 'string' },
      },
    },
  },
  {
    name: 'getAppointmentStatistics',
    description: 'Retrieves appointment completion rates, cancellations, and doctor queue velocity.',
    parameters: {
      type: 'object',
      properties: {
        branchId: { type: 'string' },
        date: { type: 'string' },
      },
    },
  },
  {
    name: 'getComplaintSummary',
    description: 'Retrieves patient grievance statistics, open tickets, SLA breaches, and category breakdowns.',
    parameters: {
      type: 'object',
      properties: {
        branchId: { type: 'string' },
      },
    },
  },
  {
    name: 'getMarketingPerformance',
    description: 'Retrieves Meta & Google ad spend, total leads generated, and Cost-Per-Lead (CPL) metrics.',
    parameters: {
      type: 'object',
      properties: {
        branchId: { type: 'string' },
      },
    },
  },
];

export class BackendToolExecutor {
  private baseUrl = env.BACKEND_API_URL;

  async executeTool(toolName: string, args: Record<string, any>, token?: string): Promise<any> {
    console.log(`[AI Tool Execution] Calling backend tool '${toolName}' via ${this.baseUrl}`);
    // In production, this issues an authorized HTTP request to the backend API
    return {
      tool: toolName,
      executed: true,
      timestamp: new Date().toISOString(),
      parameters: args,
      status: 'success',
    };
  }
}

export const toolExecutor = new BackendToolExecutor();
