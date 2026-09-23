import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    find(filter: FilterQuery<T>, skip?: number, limit?: number, sort?: any): Promise<T[]>;
    updateById(id: string, update: UpdateQuery<T>): Promise<T | null>;
    deleteById(id: string): Promise<T | null>;
    count(filter: FilterQuery<T>): Promise<number>;
}
export declare abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    find(filter?: FilterQuery<T>, skip?: number, limit?: number, sort?: any): Promise<T[]>;
    updateById(id: string, update: UpdateQuery<T>): Promise<T | null>;
    deleteById(id: string): Promise<T | null>;
    count(filter?: FilterQuery<T>): Promise<number>;
}
