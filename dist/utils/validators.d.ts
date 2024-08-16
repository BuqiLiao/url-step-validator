import type { HostType } from "../../types";
export declare const hostTypeValidationMap: {
    [key in HostType]?: (value: string) => boolean;
};
export declare const validateCondition: (condition: boolean, errMsg: string) => void;
export declare const isInRange: (value: number, range: [number, number]) => boolean;
