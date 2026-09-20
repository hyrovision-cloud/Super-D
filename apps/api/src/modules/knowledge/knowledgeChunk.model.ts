import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeChunk extends Document {
  chunkId: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  allowedRoles: string[];
  branchId: string;
  departmentId?: string;
  createdAt: Date;
}

const KnowledgeChunkSchema = new Schema<IKnowledgeChunk>(
  {
    chunkId: { type: String, required: true, unique: true, index: true },
    documentId: { type: String, required: true, index: true },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    allowedRoles: [{ type: String }],
    branchId: { type: String, default: 'all', index: true },
    departmentId: { type: String, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const KnowledgeChunkModel = mongoose.model<IKnowledgeChunk>(
  'KnowledgeChunk',
  KnowledgeChunkSchema,
  'knowledge_chunks'
);
