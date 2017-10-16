// /* eslint-disable */
let {concatMerge, loadConfig} = require('../util'),
    {mapValues, isArray, isEmpty, isString, isPlainObject} = require('lodash');

let resolveConfig = spec => {
    if(isString(spec))
        try {
            return loadConfig(spec);
        } catch (err) {
            console.warn('Could not find config file for spec!', spec);
            return {};
        }
    else if(isPlainObject(spec))
        return spec;
    else
        throw new Error(`Invalid environment spec! ${spec}`);
};


module.exports = (config, args) => {
    if(!isEmpty(args)) {
        if(isArray(args))
            args = args.reduce((hash, val) => (hash[val] = val, hash), {});

        args = mapValues(args, (val, key) => val === null ? key : val);

        let key = process.env.WEBPACK_ENV || process.env.NODE_ENV || 'development';

        let spec =  args[key];

        if(spec !== undefined || spec !== null) {
            return concatMerge(
                {},
                config,
                resolveConfig(spec)
            );
        } else return {};
    } else {
        return {};
    }
};


