export declare const ALL_SYSTEM_PERMISSIONS: string[];
export declare const INITIAL_ROLES: {
    name: string;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
}[];
export declare function seedAuthData(): Promise<void>;
