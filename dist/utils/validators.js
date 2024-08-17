import validator from 'validator';
export const hostTypeValidationMap = {
    FQDN: (value) => validator.isFQDN(value),
    ipv4: (value) => validator.isIP(value, 4),
    ipv6: (value) => validator.isIP(value, 6)
};
export const validateCondition = (condition, errMsg) => {
    if (!condition) {
        throw new Error(errMsg);
    }
};
export const isInRange = (value, range) => {
    if (value < range[0] || value > range[1]) {
        return false;
    }
    return true;
};
