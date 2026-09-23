/**
 * Background Job Queue Abstraction
 * Supports Redis-backed BullMQ in production without requiring Redis in local dev.
 */

export type JobQueueName = 'notifications' | 'email-dispatch' | 'sms-dispatch' | 'report-generation' | 'sla-escalation';

export interface JobPayload<T = any> {
  jobId?: string;
  data: T;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  attempts?: number;
  delayMs?: number;
}

export interface IQueueService {
  enqueue<T = any>(queueName: JobQueueName, payload: JobPayload<T>): Promise<string>;
  process<T = any>(queueName: JobQueueName, handler: (job: JobPayload<T>) => Promise<void>): void;
}

/**
 * In-memory fallback queue for local development
 */
export class InMemoryQueueService implements IQueueService {
  private handlers = new Map<JobQueueName, (job: JobPayload<any>) => Promise<void>>();

  async enqueue<T = any>(queueName: JobQueueName, payload: JobPayload<T>): Promise<string> {
    const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const jobWithId = { ...payload, jobId };

    const handler = this.handlers.get(queueName);
    if (handler) {
      setTimeout(async () => {
        try {
          await handler(jobWithId);
        } catch (err) {
          console.error(`[Queue:${queueName}] Job ${jobId} failed:`, err);
        }
      }, payload.delayMs || 10);
    }

    return jobId;
  }

  process<T = any>(queueName: JobQueueName, handler: (job: JobPayload<T>) => Promise<void>): void {
    this.handlers.set(queueName, handler);
  }
}

export const queueService: IQueueService = new InMemoryQueueService();
