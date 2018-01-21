const { reduce, isPlainObject, get, set } = require( 'lodash' );
const concatMerge = require( './lib/util/concat_merge' );
const co = require( 'co' );

let isVoid = x => x === undefined || x === null;

class ParentOverrideError extends Error {
    static check( key, output ) {
        if ( output.parent && !isPlainObject( output.parent )) {
            throw new Error( `
Invariant: You cannot expand the parent into a non-object at "${getParentKey( key )}".
    Evaluating -> ${ key }.
    Output     -> ${ JSON.stringify( output )}
` );
        }
    }
}

const
    SCOPED_KEYS = [ 'global', 'parent', 'local' ],

    getParentKey = ( key ) => key.split( '.' ).slice( 0, -1 ).join( '.' ),

    isScopedExpansionOutput = ( transformed ) =>
        isPlainObject( transformed ) && Object.keys( transformed ).some( x => SCOPED_KEYS.includes( x )),

    handleScopedExpansionOutput = ( config, key, { global, parent, local }) => (
        ParentOverrideError.check( key, {
            global,
            parent,
            local
        }),
        concatMerge(
            {
                meta: {
                    'expansions:DIFFS': [
                        {
                            key,
                            global,
                            parent,
                            local
                        }
                    ]
                }
            },
            config,
            !isVoid( global ) && global,
            !isVoid( parent ) && set({}, getParentKey( key ), parent ),
            !isVoid( local ) && set({}, key, local )
        )
    ),
    handleExpansionOutput = ( config, key, transformed ) => (
        ( !isVoid( transformed ))
            ? handleScopedExpansionOutput(
                config,
                key,
                isScopedExpansionOutput( transformed )
                    ? transformed
                    : { local: transformed }
            )
            : config
    ),
    runExpansions = ( initialConfig ) => {
        const expansions = initialConfig.meta.expansions;
        return co( function* reduceExpansions() {
            let config = initialConfig;
            for ( let { key, transform } of expansions ) {
                let arg = get( config, key ),
                    parent = get( config, getParentKey( key )),
                    transformed = transform( arg, {
                        parent,
                        global: config,
                        config
                    });
                if ( transformed && transformed.then )
                    transformed = yield transformed;

                config = ( handleExpansionOutput( config, key, transformed ));
            }
            return config;
        });
    };

module.exports = runExpansions;
