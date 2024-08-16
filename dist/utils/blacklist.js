"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlacklist = void 0;
const lodash_1 = require("lodash");
const validators_1 = require("./validators");
const validateBlacklistAND = (title, value, blacklist) => {
    const isBlacklisted = blacklist.values &&
        blacklist.values.includes(value) &&
        blacklist.types &&
        blacklist.types.some((type) => { var _a; return (_a = validators_1.hostTypeValidationMap[type]) === null || _a === void 0 ? void 0 : _a.call(validators_1.hostTypeValidationMap, value); }) &&
        blacklist.start_with &&
        blacklist.start_with.some((prefix) => value.startsWith(prefix)) &&
        blacklist.end_with &&
        blacklist.end_with.some((suffix) => value.endsWith(suffix)) &&
        blacklist.contains &&
        blacklist.contains.some((substring) => value.includes(substring)) &&
        blacklist.interval &&
        (0, validators_1.isInRange)(parseInt(value), blacklist.interval);
    if (!isBlacklisted) {
        const conditions = [];
        if (blacklist.values)
            conditions.push(`one of "${blacklist.values.join('", "')}"`);
        if (blacklist.types)
            conditions.push(`of type "${blacklist.types.join('", "')}"`);
        if (blacklist.start_with)
            conditions.push(`starting with "${blacklist.start_with.join('", "')}"`);
        if (blacklist.end_with)
            conditions.push(`ending with "${blacklist.end_with.join('", "')}"`);
        if (blacklist.contains)
            conditions.push(`containing "${blacklist.contains.join('", "')}"`);
        if (blacklist.interval)
            conditions.push(`between ${blacklist.interval[0]} and ${blacklist.interval[1]}`);
        throw new Error(`${title} should not be ${conditions.join(" and ")}`);
    }
};
const validateBlacklistOR = (title, value, blacklist) => {
    const { values, types, start_with, end_with, contains, interval } = blacklist;
    values && (0, validators_1.validateCondition)(!values.includes(value), `${title} should be "${values.join('" or "')}"`);
    types &&
        (0, validators_1.validateCondition)(!types.some((type) => { var _a; return (_a = validators_1.hostTypeValidationMap[type]) === null || _a === void 0 ? void 0 : _a.call(validators_1.hostTypeValidationMap, value); }), `${title} should be of type "${types.join('" or "')}"`);
    start_with &&
        (0, validators_1.validateCondition)(!start_with.some((prefix) => value.startsWith(prefix)), `${title} should start with "${start_with.join('" or "')}"`);
    end_with &&
        (0, validators_1.validateCondition)(!end_with.some((suffix) => value.endsWith(suffix)), `${title} should end with "${end_with.join('" or "')}"`);
    contains &&
        (0, validators_1.validateCondition)(contains.some((substring) => value.includes(substring)), `${title} should contain "${contains.join('" or "')}"`);
    interval &&
        (0, validators_1.validateCondition)(!(0, validators_1.isInRange)(parseInt(value), interval), `${title} should be between ${interval[0]} and ${interval[1]}`);
};
const validateBlacklist = (title, value, blacklist) => {
    if ((0, lodash_1.isNil)(blacklist) || (0, lodash_1.isNil)(value))
        return;
    const combine = (blacklist === null || blacklist === void 0 ? void 0 : blacklist.combine) || "or";
    combine === "and" ? validateBlacklistAND(title, value, blacklist) : validateBlacklistOR(title, value, blacklist);
};
exports.validateBlacklist = validateBlacklist;
