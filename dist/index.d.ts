import type { URLValidationOptions, StringOptions } from "../types/index.js";
export declare const isValidUrl: (value: string, options: URLValidationOptions) => {
    fragment?: string | undefined;
    query?: URLSearchParams | undefined;
    port?: string | undefined;
    host?: string | undefined;
    protocol?: string | undefined;
};
export declare const isValidString: (value: string, errorLabel?: string, options?: StringOptions) => void;
