import mongoose from 'mongoose';
export declare function connectDatabase(): Promise<typeof mongoose>;
export declare function isDatabaseConnected(): boolean;
export declare function disconnectDatabase(): Promise<void>;
