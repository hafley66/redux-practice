let
    {isString, isEqual, merge, isArray, uniq} = require('lodash'),

    TELLS_LODASH_TO_USE_DEFAULT_MERGE_COLLISION_RESOLUTION = undefined,

    isNotStringArray = ary => isArray(ary) && !isString(ary),

    mergeArrays = (a,b) =>
        isString(a) && isArray(b)
            ? uniq(b.concat([a]))
            : isArray(a) && isString(b)
                ? uniq(a.concat([b]))
                : isNotStringArray(a) && isNotStringArray(b)
                    ? isEqual(a,b) ? a.slice() : uniq(a.concat(b))
                    : TELLS_LODASH_TO_USE_DEFAULT_MERGE_COLLISION_RESOLUTION,

    concatMerge = (...args) => merge(...args, mergeArrays);

module.exports = concatMerge;
