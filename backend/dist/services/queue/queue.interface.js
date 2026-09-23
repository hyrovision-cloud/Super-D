"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueService = exports.InMemoryQueueService = void 0;
class InMemoryQueueService {
    handlers = new Map();
    async enqueue(queueName, payload) {
        const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const jobWithId = { ...payload, jobId };
        const handler = this.handlers.get(queueName);
        if (handler) {
            setTimeout(async () => {
                try {
                    await handler(jobWithId);
                }
                catch (err) {
                    console.error(`[Queue:${queueName}] Job ${jobId} failed:`, err);
                }
            }, payload.delayMs || 10);
        }
        return jobId;
    }
    process(queueName, handler) {
        this.handlers.set(queueName, handler);
    }
}
exports.InMemoryQueueService = InMemoryQueueService;
exports.queueService = new InMemoryQueueService();
