import { isNil } from "lodash-es";
import { validateCondition, isInRange, hostTypeValidationMap } from "./validators.js";
const validateBlacklistAND = (title, value, blacklist) => {
    const isBlacklisted = blacklist.values &&
        blacklist.values.includes(value) &&
        blacklist.types &&
        blacklist.types.some((type) => hostTypeValidationMap[type]?.(value)) &&
        blacklist.start_with &&
        blacklist.start_with.some((prefix) => value.startsWith(prefix)) &&
        blacklist.end_with &&
        blacklist.end_with.some((suffix) => value.endsWith(suffix)) &&
        blacklist.contains &&
        blacklist.contains.some((substring) => value.includes(substring)) &&
        blacklist.interval &&
        isInRange(parseInt(value), blacklist.interval);
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
    values && validateCondition(!values.includes(value), `${title} should not be "${values.join('" or "')}"`);
    types &&
        validateCondition(!types.some((type) => hostTypeValidationMap[type]?.(value)), `${title} should not be of type "${types.join('" or "')}"`);
    start_with &&
        validateCondition(!start_with.some((prefix) => value.startsWith(prefix)), `${title} should not start with "${start_with.join('" or "')}"`);
    end_with &&
        validateCondition(!end_with.some((suffix) => value.endsWith(suffix)), `${title} should not end with "${end_with.join('" or "')}"`);
    contains &&
        validateCondition(!contains.some((substring) => value.includes(substring)), `${title} should not contain "${contains.join('" or "')}"`);
    interval &&
        validateCondition(!isInRange(parseInt(value), interval), `${title} should not be between ${interval[0]} and ${interval[1]}`);
};
export const validateBlacklist = (title, value, blacklist) => {
    if (isNil(blacklist) || isNil(value))
        return;
    const combine = blacklist?.combine || "or";
    combine === "and" ? validateBlacklistAND(title, value, blacklist) : validateBlacklistOR(title, value, blacklist);
};
