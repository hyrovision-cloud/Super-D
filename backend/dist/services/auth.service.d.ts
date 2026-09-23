export interface SafeUser {
    id: string;
    name: string;
    email: string;
    role: string;
    roles: string[];
    permissions: string[];
    primaryBranchId: string;
    assignedBranches: string[];
    status: string;
}
export interface LoginResult {
    token: string;
    user: SafeUser;
}
export declare class AuthService {
    login(email: string, passwordPlain: string, rememberMe?: boolean, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<LoginResult>;
    getMe(userId: string): Promise<SafeUser>;
}
export declare const authService: AuthService;
