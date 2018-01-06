export declare const apiHeaders: () => {
    "Content-Type": string;
    "cache-control": string;
    "x-api-key": string;
    "Access-Control-Allow-Credentials": string;
    "Access-Control-Allow-Origin": string;
};
export declare const withToken: (headers: any) => (token: string) => any;
