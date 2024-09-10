
export interface User {
    name: string;
    email: string;
    password: string;
    role?: string;
    is_super_admin?: boolean;
    token: string;
}
