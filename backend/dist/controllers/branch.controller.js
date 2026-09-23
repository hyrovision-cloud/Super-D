"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchController = exports.BranchController = void 0;
const Branch_model_1 = require("../models/Branch.model");
const IncomeRecord_model_1 = require("../models/IncomeRecord.model");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
class BranchController {
    async getAllBranches(req, res, next) {
        try {
            const branches = await Branch_model_1.BranchModel.find({ isActive: true, ...(req.scopeFilter || {}) });
            (0, response_1.sendSuccess)(res, branches, 'Branches retrieved successfully.', 200, { total: branches.length });
        }
        catch (err) {
            next(err);
        }
    }
    async getBranchById(req, res, next) {
        try {
            const branch = await Branch_model_1.BranchModel.findOne({ $or: [{ branchId: req.params.id }, ...(req.params.id.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.id }] : [])], ...(req.scopeFilter || {}) });
            if (!branch) {
                throw new AppError_1.NotFoundError('Branch', req.params.id);
            }
            (0, response_1.sendSuccess)(res, branch, 'Branch retrieved successfully.');
        }
        catch (err) {
            next(err);
        }
    }
    async getBranchComparison(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const dateFilter = { status: 'ACTIVE' };
            if (startDate || endDate) {
                dateFilter.transactionDate = {};
                if (startDate)
                    dateFilter.transactionDate.$gte = new Date(startDate);
                if (endDate)
                    dateFilter.transactionDate.$lte = new Date(endDate);
            }
            const activeBranches = await Branch_model_1.BranchModel.find({ isActive: true }).sort({ name: 1 });
            const revenueAggregate = await IncomeRecord_model_1.IncomeRecordModel.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$branchId',
                        totalRevenue: { $sum: '$amount' },
                        transactionCount: { $sum: 1 },
                    },
                },
            ]);
            const revenueMap = new Map();
            revenueAggregate.forEach((item) => {
                revenueMap.set(item._id, {
                    totalRevenue: item.totalRevenue,
                    transactionCount: item.transactionCount,
                });
            });
            const branches = activeBranches.map((b) => {
                const stats = revenueMap.get(b.branchId) || { totalRevenue: 0, transactionCount: 0 };
                return {
                    branchId: b.branchId,
                    branchName: b.name,
                    code: b.code,
                    city: b.city,
                    bedCapacity: b.bedCapacity,
                    revenue: stats.totalRevenue,
                    transactionCount: stats.transactionCount,
                };
            });
            (0, response_1.sendSuccess)(res, { branches }, 'Branch comparison retrieved successfully.', 200, {
                totalConfiguredBranches: activeBranches.length,
                returnedBranches: branches.length,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.BranchController = BranchController;
exports.branchController = new BranchController();
