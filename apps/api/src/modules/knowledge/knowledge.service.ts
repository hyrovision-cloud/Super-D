import { KnowledgeDocModel, IKnowledgeDocument } from './knowledgeDoc.model';
import { KnowledgeChunkModel, IKnowledgeChunk } from './knowledgeChunk.model';

export class KnowledgeService {
  async searchKnowledge(
    queryText: string,
    userRoles: string[],
    userBranches: string[],
    userDepartment?: string
  ): Promise<IKnowledgeChunk[]> {
    const isOwnerOrAdmin = userRoles.includes('Hospital Owner') || userRoles.includes('Global Admin');

    const filter: Record<string, any> = {};

    if (!isOwnerOrAdmin) {
      filter.$and = [
        {
          $or: [{ allowedRoles: { $in: userRoles } }, { allowedRoles: { $size: 0 } }],
        },
        {
          $or: [{ branchId: 'all' }, { branchId: { $in: userBranches } }],
        },
      ];
    }

    if (queryText) {
      filter.text = new RegExp(queryText.trim(), 'i');
    }

    return KnowledgeChunkModel.find(filter).limit(5);
  }

  async createDocument(data: Partial<IKnowledgeDocument>): Promise<IKnowledgeDocument> {
    const doc = await KnowledgeDocModel.create(data);

    // Split content into chunks of ~500 characters
    const paragraphs = data.content?.split('\n\n') || [data.content || ''];
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].trim()) {
        await KnowledgeChunkModel.create({
          chunkId: `chk_${doc.documentId}_${i}`,
          documentId: doc.documentId,
          chunkIndex: i,
          text: paragraphs[i].trim(),
          allowedRoles: doc.allowedRoles,
          branchId: doc.branchId,
          departmentId: doc.departmentId,
        });
      }
    }

    return doc;
  }
}

export const knowledgeService = new KnowledgeService();
