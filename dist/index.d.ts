import type { URLValidationOptions } from "./index.d";
export declare const isValidUrl: (value: string, options: URLValidationOptions) => {
    fragment?: string | undefined;
    query?: URLSearchParams | undefined;
    port?: string | undefined;
    host?: string | undefined;
    protocol?: string | undefined;
};
