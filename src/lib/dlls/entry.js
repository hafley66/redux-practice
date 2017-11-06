const
    pathFn = require('../../util/path'),
    {isPlainObject, isEmpty, isString, uniq, flatten, keys, mapValues, memoize, isRegExp} =  require('lodash'),
    DSL_REGEX_REX = /^\s*=~\s*/i;

let isRegex = str => (
        isRegExp(str) || (
            isString(str) && str.match(DSL_REGEX_REX)
        )
    ),
    normalizeRegex = str => isRegExp(str)
        ? str
        : new RegExp(str.replace(DSL_REGEX_REX, ''));

let
    packageJson = memoize(
        () => keys(require(
            pathFn(process.cwd(), 'package.json').str()
        ).dependencies)
    ),
    expandVendors = vendors => ([
        ...vendors.filter(v=>!isRegex(v)),
        ...flatten(
            vendors
                .filter(v=>isRegex(v))
                .map(normalizeRegex)
                .map(vendorRex =>
                    packageJson()
                        .filter(dep=>dep.match(vendorRex))
                )
        )
    ]),
    expandAllEntries = (entries) =>mapValues(
        entries,
        vendors =>
            uniq(expandVendors(vendors))

    );


module.exports = ( __, slice, parent = {} ) => {
    if(!slice && parent && !isEmpty(parent) && isPlainObject(parent))
        slice = parent;
    return ({
        parent: {'entry:expanded': expandAllEntries(slice)}
    });
};
