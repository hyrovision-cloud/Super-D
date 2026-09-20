import mongoose, { Schema, Document } from 'mongoose';

export interface IAiQueryAuditLog extends Document {
  userId: string;
  userRole: string;
  query: string;
  promptHash: string;
  toolsCalled: string[];
  filterScope: Record<string, any>;
  latencyMs: number;
  answerSummary: string;
  createdAt: Date;
}

const AiQueryAuditLogSchema = new Schema<IAiQueryAuditLog>(
  {
    userId: { type: String, required: true, index: true },
    userRole: { type: String, required: true },
    query: { type: String, required: true },
    promptHash: { type: String, required: true },
    toolsCalled: [{ type: String }],
    filterScope: { type: Schema.Types.Mixed },
    latencyMs: { type: Number, required: true },
    answerSummary: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const AiQueryAuditLogModel = mongoose.model<IAiQueryAuditLog>(
  'AiQueryAuditLog',
  AiQueryAuditLogSchema,
  'ai_query_audit_logs'
);
