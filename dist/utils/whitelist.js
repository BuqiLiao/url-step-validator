"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWhitelist = void 0;
const lodash_1 = require("lodash");
const validators_1 = require("./validators");
const validateWhitelistAND = (title, value, whitelist) => {
    const { values, types, start_with, end_with, contains, interval } = whitelist;
    values && (0, validators_1.validateCondition)(values.includes(value), `${title} should be "${values.join('" or "')}"`);
    types &&
        (0, validators_1.validateCondition)(types.some((type) => { var _a; return (_a = validators_1.hostTypeValidationMap[type]) === null || _a === void 0 ? void 0 : _a.call(validators_1.hostTypeValidationMap, value); }), `${title} should be of type "${types.join('" or "')}"`);
    start_with &&
        (0, validators_1.validateCondition)(start_with.some((prefix) => value.startsWith(prefix)), `${title} should start with "${start_with.join('" or "')}"`);
    end_with &&
        (0, validators_1.validateCondition)(end_with.some((suffix) => value.endsWith(suffix)), `${title} should end with "${end_with.join('" or "')}"`);
    contains &&
        (0, validators_1.validateCondition)(contains.some((substring) => value.includes(substring)), `${title} should contain "${contains.join('" or "')}"`);
    interval &&
        (0, validators_1.validateCondition)((0, validators_1.isInRange)(parseInt(value), interval), `${title} should be between ${interval[0]} and ${interval[1]}`);
};
const validateWhitelistOR = (title, value, whitelist) => {
    const isWhitelisted = (whitelist.values && whitelist.values.includes(value)) ||
        (whitelist.types && whitelist.types.some((type) => { var _a; return (_a = validators_1.hostTypeValidationMap[type]) === null || _a === void 0 ? void 0 : _a.call(validators_1.hostTypeValidationMap, value); })) ||
        (whitelist.start_with && whitelist.start_with.some((prefix) => value.startsWith(prefix))) ||
        (whitelist.end_with && whitelist.end_with.some((suffix) => value.endsWith(suffix))) ||
        (whitelist.contains && whitelist.contains.some((substring) => value.includes(substring))) ||
        (whitelist.interval && (0, validators_1.isInRange)(parseInt(value), whitelist.interval));
    if (!isWhitelisted) {
        const conditions = [];
        if (whitelist.values)
            conditions.push(`one of "${whitelist.values.join('", "')}"`);
        if (whitelist.types)
            conditions.push(`of type "${whitelist.types.join('", "')}"`);
        if (whitelist.start_with)
            conditions.push(`starting with "${whitelist.start_with.join('", "')}"`);
        if (whitelist.end_with)
            conditions.push(`ending with "${whitelist.end_with.join('", "')}"`);
        if (whitelist.contains)
            conditions.push(`containing "${whitelist.contains.join('", "')}"`);
        if (whitelist.interval)
            conditions.push(`between ${whitelist.interval[0]} and ${whitelist.interval[1]}`);
        throw new Error(`${title} should be ${conditions.join(" or ")}`);
    }
};
const validateWhitelist = (title, value, whitelist) => {
    if ((0, lodash_1.isNil)(whitelist) || (0, lodash_1.isNil)(value))
        return;
    const combine = (whitelist === null || whitelist === void 0 ? void 0 : whitelist.combine) || "and";
    combine === "and" ? validateWhitelistAND(title, value, whitelist) : validateWhitelistOR(title, value, whitelist);
};
exports.validateWhitelist = validateWhitelist;
