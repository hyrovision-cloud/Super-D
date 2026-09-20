import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeDocument extends Document {
  documentId: string;
  title: string;
  documentType: 'POLICY' | 'SOP' | 'CLINICAL_GUIDELINE' | 'EMERGENCY_PROTOCOL';
  branchId: string;
  departmentId?: string;
  confidentiality: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';
  allowedRoles: string[];
  content: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeDocSchema = new Schema<IKnowledgeDocument>(
  {
    documentId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    documentType: {
      type: String,
      enum: ['POLICY', 'SOP', 'CLINICAL_GUIDELINE', 'EMERGENCY_PROTOCOL'],
      required: true,
      index: true,
    },
    branchId: { type: String, default: 'all', index: true },
    departmentId: { type: String, index: true },
    confidentiality: {
      type: String,
      enum: ['PUBLIC', 'INTERNAL', 'RESTRICTED'],
      default: 'INTERNAL',
      index: true,
    },
    allowedRoles: [{ type: String }],
    content: { type: String, required: true },
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

export const KnowledgeDocModel = mongoose.model<IKnowledgeDocument>(
  'KnowledgeDocument',
  KnowledgeDocSchema,
  'knowledge_documents'
);
