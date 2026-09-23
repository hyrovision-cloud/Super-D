import mongoose, { Document } from 'mongoose';
import { RoleName } from '../config/constants';
export interface IRole extends Document {
    name: RoleName;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RoleModel: mongoose.Model<IRole, {}, {}, {}, mongoose.Document<unknown, {}, IRole, {}, {}> & IRole & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
