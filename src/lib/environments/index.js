let {loadConfig} = require('../util'),
    {mapValues, isArray, isEmpty, isString, isPlainObject} = require('lodash');

module.exports = {
    normalizer: (environments) => {
        let e = environments;
        if(!isEmpty(e)) {
            if(isArray(e))
                e = e.reduce((hash, val) => (hash[val] = val, hash), {});
            return mapValues(e, (val, key) => val === null ? key : val);
        }
        else return null;
    },
    expander: (args) => {
        let key = process.env.WEBPACK_ENV || process.env.NODE_ENV || 'development';

        if(args[key]) {
            return {
                global: resolveConfig(args[key])
            };
        }
    }
};

function resolveConfig(spec) {
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
}
