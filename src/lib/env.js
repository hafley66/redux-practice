let
    webpack = require('webpack'),
    {merge, pick, isString, isArray, omit} = require('lodash'),
    SPECIAL_KEYS = ['from-array', 'from-file'],
    loadConfig = require('./util/load_config');

module.exports = (__, slice) => {
    if(!slice) {
        return {};
    } else{

        let expanded = checkSpecialKeys(checkFromType(slice));
        return {
            config: {
                plugins: [
                    new webpack.EnvironmentPlugin(expanded)
                ]
            },
            parent: {
                'env:expanded': expanded
            }
        };
    }
};

function expandArray(array) {
    return pick(process.env, array);
}

function expandPath(str) {
    let loaded =  loadConfig(str);
    return loaded;
}

function checkFromType(slice) {
    if(isArray(slice))
        return {'from-array': slice};
    else if(isString(slice))
        return {'from-file': slice};
    else
        return slice;
}

function checkSpecialKeys(slice) {
    let {'from-array': ary, 'from-file': path} = slice;

    return  merge(
        {},
        path && expandPath(path),
        ary && expandArray(ary),
        omit(slice, SPECIAL_KEYS)
    );
}
