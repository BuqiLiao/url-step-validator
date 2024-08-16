"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = void 0;
const lodash_es_1 = require("lodash-es");
const utils_1 = require("./utils");
const defaultOptions = {
    protocol_config: {
        required: true
    },
    host_config: {
        required: true
    },
    port_config: {
        required: false,
        whitelist: {
            interval: [0, 65535]
        }
    },
    query_key_config: {
        allowed: true
    },
    fragment_config: {
        allowed: true
    }
};
const isValidUrl = (value, options) => {
    var _a;
    if (!(0, lodash_es_1.isString)(value)) {
        throw new Error("URL should be a string");
    }
    if (value.trim() === "") {
        throw new Error("URL cannot be empty");
    }
    options = (0, lodash_es_1.merge)(defaultOptions, options);
    const { protocol_config, host_config, port_config, query_key_config, fragment_config } = options;
    let url = value;
    let protocol, host, port, query, fragment;
    /***************************************** Protocol Validation *****************************************/
    const protocolRegEx = /^([a-zA-Z][a-zA-Z\d+\-.]*):\/\//;
    const protocolMatch = url.match(protocolRegEx);
    if (protocolMatch) {
        protocol = protocolMatch[1];
        (0, utils_1.validateWhitelist)("Protocol", protocol, protocol_config === null || protocol_config === void 0 ? void 0 : protocol_config.whitelist);
        (0, utils_1.validateBlacklist)("Protocol", protocol, protocol_config === null || protocol_config === void 0 ? void 0 : protocol_config.blacklist);
        url = url.slice(protocolMatch[0].length);
    }
    else if (protocol_config === null || protocol_config === void 0 ? void 0 : protocol_config.required) {
        throw new Error('URL should start with a valid protocol followed by "://"');
    }
    /***************************************** Host Validation *****************************************/
    const hostRegEx = /^([^/:?#]+)/;
    const hostMatch = url.match(hostRegEx);
    if (hostMatch) {
        host = hostMatch[1];
        (0, utils_1.validateWhitelist)("Host", host, host_config === null || host_config === void 0 ? void 0 : host_config.whitelist);
        (0, utils_1.validateBlacklist)("Host", host, host_config === null || host_config === void 0 ? void 0 : host_config.blacklist);
        url = url.slice(hostMatch[0].length);
    }
    else if (host_config === null || host_config === void 0 ? void 0 : host_config.required) {
        throw new Error("Host should not be empty");
    }
    /***************************************** Port Validation *****************************************/
    const portRegEx = /:(\d+)/;
    const portMatch = url.match(portRegEx);
    if (portMatch) {
        port = portMatch[1];
        (0, utils_1.validateWhitelist)("Port", port, port_config === null || port_config === void 0 ? void 0 : port_config.whitelist);
        (0, utils_1.validateBlacklist)("Port", port, port_config === null || port_config === void 0 ? void 0 : port_config.blacklist);
        url = url.slice(portMatch[0].length);
    }
    else if (port_config === null || port_config === void 0 ? void 0 : port_config.required) {
        throw new Error("Port should not be empty");
    }
    /***************************************** Query Validation *****************************************/
    if (!(query_key_config === null || query_key_config === void 0 ? void 0 : query_key_config.allowed)) {
        if (url.includes("?")) {
            throw new Error('Should not contain query symbol "?"');
        }
    }
    else {
        const queryRegEx = /\?([^#]*)/;
        const queryMatch = url.match(queryRegEx);
        // If query is present, test the whitelist and blacklist
        if (queryMatch) {
            const queryString = queryMatch[1];
            if (!queryString) {
                throw new Error("Query should not be empty");
            }
            query = new URLSearchParams(queryString);
            for (const [key, value] of query) {
                (0, utils_1.validateWhitelist)("Query parameter", key, query_key_config.whitelist);
                (0, utils_1.validateBlacklist)("Query parameter", key, query_key_config.blacklist);
                const valueConfig = (_a = options.query_value_config) === null || _a === void 0 ? void 0 : _a[key];
                if (valueConfig) {
                    if (value) {
                        (0, utils_1.validateWhitelist)(`Query "${key}" value`, value, valueConfig === null || valueConfig === void 0 ? void 0 : valueConfig.whitelist);
                        (0, utils_1.validateBlacklist)(`Query "${key}" value`, value, valueConfig === null || valueConfig === void 0 ? void 0 : valueConfig.blacklist);
                    }
                    else if (valueConfig.required) {
                        throw new Error(`Query "${key}" value should not be empty`);
                    }
                }
            }
            url = url.slice(queryMatch[0].length);
        }
    }
    /***************************************** Fragment Validation *****************************************/
    if (!(fragment_config === null || fragment_config === void 0 ? void 0 : fragment_config.allowed)) {
        if (value.includes("#")) {
            throw new Error('Should not contain fregment symbol "#"');
        }
    }
    else {
        const fragmentRegEx = /#([^#]*)/;
        const fragmentMatch = url.match(fragmentRegEx);
        if (fragmentMatch) {
            fragment = fragmentMatch[1];
            (0, utils_1.validateWhitelist)("Fragment", fragment, fragment_config.whitelist);
            (0, utils_1.validateBlacklist)("Fragment", fragment, fragment_config.blacklist);
            url = url.slice(fragmentMatch[0].length);
        }
    }
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (!(0, lodash_es_1.isNil)(protocol) && { protocol })), (!(0, lodash_es_1.isNil)(host) && { host })), (!(0, lodash_es_1.isNil)(port) && { port })), (!(0, lodash_es_1.isNil)(query) && { query })), (!(0, lodash_es_1.isNil)(fragment) && { fragment }));
};
exports.isValidUrl = isValidUrl;
