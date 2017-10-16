const
    concatMerge = require('../concat_merge'),
    {set, get, isEmpty} = require('lodash');

module.exports = (
    {
        merge = concatMerge
        ,
        gets = get
    } = {}
) => {
    let API = {};
    Object.assign(API, {
        joinPaths: (config, path1, path2) => [path1, path2].join('.'),
        parentPath: (config, path) => path.split('.').slice(0, -1).join('.'),

        inputs: (config, path, parentPath = API.parentPath(config, path)) => (
            [
                config,
                gets(config, path),
                gets(config, parentPath)
            ]
        )
        ,
        outputs: (prevConfig, path, parentPath = API.parentPath(prevConfig, path)) =>
            (output, {config, slice, parent} = output) => (
                !isEmpty(output)
                &&
                !(config || slice || parent)
                &&
                (config = output),
                merge(
                    {},
                    prevConfig,
                    parent ? set({}, parentPath, parent) : undefined,
                    slice ? set({}, path, slice) : undefined,
                    config
                )
            )
    });
    return API;
};
