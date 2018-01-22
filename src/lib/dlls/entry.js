const
    { mapKeys, isPlainObject, isEmpty, isString, uniq, flatten, keys, mapValues, isRegExp } =  require( 'lodash' ),
    DSL_REGEX_REX = /^\s*=~\s*/i;

let isRegex = str => (
        isRegExp( str ) || (
            isString( str ) && str.match( DSL_REGEX_REX )
        )
    ),
    normalizeRegex = str => isRegExp( str )
        ? str
        : new RegExp( str.replace( DSL_REGEX_REX, '' ));

let expandVendors = ( packageJson, vendors ) => ([
        ...vendors.filter( v => !isRegex( v )),
        ...flatten(
            vendors
                .filter( v => isRegex( v ))
                .map( normalizeRegex )
                .map( vendorRex =>
                    packageJson
                        .filter( dep => dep.match( vendorRex ))
                )
        )
    ]),
    expandAllEntries = ( packageJson, entries ) => mapValues(
        entries,
        vendors =>
            uniq( expandVendors( packageJson, vendors ))
    );


module.exports = ( slice, { config, parent }) => {
    let { dependencies } = config.meta.cache.packageJson.value;
    if ( !slice && parent && !isEmpty( parent ) && isPlainObject( parent ))
        slice = parent;
    let entries = expandAllEntries( keys( dependencies ), slice );

    let order = 0;
    const orderedEntries = mapKeys(
        entries,
        ( vendorsArray, dllName ) => `0${order++}-${dllName}`
    );

    return ({
        parent: { 'entry:expanded': orderedEntries }
    });
};
