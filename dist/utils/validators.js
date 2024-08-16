"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInRange = exports.validateCondition = exports.hostTypeValidationMap = void 0;
const validator_1 = require("validator");
exports.hostTypeValidationMap = {
    FQDN: (value) => (0, validator_1.isFQDN)(value),
    ipv4: (value) => (0, validator_1.isIP)(value, 4),
    ipv6: (value) => (0, validator_1.isIP)(value, 6)
};
const validateCondition = (condition, errMsg) => {
    if (!condition) {
        throw new Error(errMsg);
    }
};
exports.validateCondition = validateCondition;
const isInRange = (value, range) => {
    if (value < range[0] || value > range[1]) {
        return false;
    }
    return true;
};
exports.isInRange = isInRange;
