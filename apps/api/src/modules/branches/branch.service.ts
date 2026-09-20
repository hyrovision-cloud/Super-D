import { BranchModel, IBranch } from './branch.model';
import { NotFoundError } from '../../common/errors/AppError';

export class BranchService {
  async getAllBranches(filter: Record<string, any> = {}): Promise<IBranch[]> {
    return BranchModel.find(filter).sort({ name: 1 });
  }

  async getBranchById(branchId: string): Promise<IBranch> {
    const branch = await BranchModel.findOne({
      $or: [{ branchId }, { _id: branchId }],
    });
    if (!branch) {
      throw new NotFoundError('Branch', branchId);
    }
    return branch;
  }

  async createBranch(data: Partial<IBranch>): Promise<IBranch> {
    return BranchModel.create(data);
  }

  async updateBranch(branchId: string, data: Partial<IBranch>): Promise<IBranch> {
    const branch = await BranchModel.findOneAndUpdate(
      { $or: [{ branchId }, { _id: branchId }] },
      { $set: data },
      { new: true }
    );
    if (!branch) {
      throw new NotFoundError('Branch', branchId);
    }
    return branch;
  }
}

export const branchService = new BranchService();
