import "isomorphic-fetch";
export declare function auth(user: {
    email: string;
    password: string;
}): any;
export declare function tokenAuth(token: string): any;
export declare function logout(token: string): any;
export declare function signup(user: any): any;
