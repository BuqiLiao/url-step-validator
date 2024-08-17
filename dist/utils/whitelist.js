import { isNil } from "lodash-es";
import { validateCondition, isInRange, hostTypeValidationMap } from "./validators.js";
const validateWhitelistAND = (title, value, whitelist) => {
    const { values, types, start_with, end_with, contains, interval } = whitelist;
    values && validateCondition(values.includes(value), `${title} should be "${values.join('" or "')}"`);
    types &&
        validateCondition(types.some((type) => hostTypeValidationMap[type]?.(value)), `${title} should be of type "${types.join('" or "')}"`);
    start_with &&
        validateCondition(start_with.some((prefix) => value.startsWith(prefix)), `${title} should start with "${start_with.join('" or "')}"`);
    end_with &&
        validateCondition(end_with.some((suffix) => value.endsWith(suffix)), `${title} should end with "${end_with.join('" or "')}"`);
    contains &&
        validateCondition(contains.some((substring) => value.includes(substring)), `${title} should contain "${contains.join('" or "')}"`);
    interval &&
        validateCondition(isInRange(parseInt(value), interval), `${title} should be between ${interval[0]} and ${interval[1]}`);
};
const validateWhitelistOR = (title, value, whitelist) => {
    const isWhitelisted = (whitelist.values && whitelist.values.includes(value)) ||
        (whitelist.types && whitelist.types.some((type) => hostTypeValidationMap[type]?.(value))) ||
        (whitelist.start_with && whitelist.start_with.some((prefix) => value.startsWith(prefix))) ||
        (whitelist.end_with && whitelist.end_with.some((suffix) => value.endsWith(suffix))) ||
        (whitelist.contains && whitelist.contains.some((substring) => value.includes(substring))) ||
        (whitelist.interval && isInRange(parseInt(value), whitelist.interval));
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
export const validateWhitelist = (title, value, whitelist) => {
    if (isNil(whitelist) || isNil(value))
        return;
    const combine = whitelist?.combine || "and";
    combine === "and" ? validateWhitelistAND(title, value, whitelist) : validateWhitelistOR(title, value, whitelist);
};
