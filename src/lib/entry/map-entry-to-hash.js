let { isArray, isPlainObject, isString, mapValues } = require( 'lodash' );
module.exports = ( entry, { config }) => {
    if ( isArray( entry ))
        entry = entry.reduce(( sum, key ) => ({ [ key ]: [ key ] }), {});
    if ( isPlainObject( entry ))
        entry = mapValues( entry, ( val ) => isArray( val ) ? val : [ val ]);
    if ( isString( entry ))
        entry = { [ entry ]: [ entry ] };
    config.entry = entry;
    return;
};
