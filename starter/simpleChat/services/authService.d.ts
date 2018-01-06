import "isomorphic-fetch";
export declare function auth(user: {
    email: string;
    password: string;
}): Promise<Response>;
export declare function tokenAuth(token: string): Promise<Response>;
export declare function logout(token: string): Promise<Response>;
export declare function signup(user: any): Promise<Response>;
