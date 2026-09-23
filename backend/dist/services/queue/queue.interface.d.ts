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
export declare class InMemoryQueueService implements IQueueService {
    private handlers;
    enqueue<T = any>(queueName: JobQueueName, payload: JobPayload<T>): Promise<string>;
    process<T = any>(queueName: JobQueueName, handler: (job: JobPayload<T>) => Promise<void>): void;
}
export declare const queueService: IQueueService;
