import { isIP, isFQDN } from "validator";
import type { HostType } from "../index.d";

export const hostTypeValidationMap: { [key in HostType]?: (value: string) => boolean } = {
  FQDN: (value) => isFQDN(value),
  ipv4: (value) => isIP(value, 4),
  ipv6: (value) => isIP(value, 6)
};

export const validateCondition = (condition: boolean, errMsg: string) => {
  if (!condition) {
    throw new Error(errMsg);
  }
};

export const isInRange = (value: number, range: [number, number]) => {
  if (value < range[0] || value > range[1]) {
    return false;
  }
  return true;
};
