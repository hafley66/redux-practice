import {
    flatten,
    uniq,
    isRegExp,
    isArray,
    isPlainObject,
    isString,
    mapValues,
    mapKeys
} from 'lodash';

let pickFirst = ( x ) => x,
    ensureArray = ( val ) => isArray( val ) ? val : [ val ];

export const
    DSL_REGEX_REX = /^\s*=~\s*/i,

    isRegex = str => (
        isRegExp( str ) || (
            isString( str ) && str.match( DSL_REGEX_REX )
        )
    ),

    normalizeRegex = str => isRegExp( str )
        ? str
        : new RegExp( str.replace( DSL_REGEX_REX, '' )),

    expandSpecialRegexKeysIterator = ( withRespectTo ) => ( arrayOfStrings ) => (
        uniq([
            ...arrayOfStrings.filter( v => !isRegex( v )),
            ...flatten(
                arrayOfStrings
                    .filter( v => isRegex( v ))
                    .map( normalizeRegex )
                    .map( vendorRex =>
                        withRespectTo.filter( dep => dep.match( vendorRex ))
                    )
            )
        ])
    ),

    expandSpecialRegexKeys = ( withRespectTo ) => ( entries ) => mapValues(
        entries,
        expandSpecialRegexKeysIterator( withRespectTo )
    ),
    fixPublicPath = ( p ) => {
        if ( p === '/' ) {
            return p;
        }
        if ( !p.match( /^\// )) {
            p = `/${p}`;
        }
        if ( !p.match( /\/$/ )) {
            p = `${p}/`;
        }
        return p;
    },

    mapEntryToHash = ( entry ) => {
        if ( isString( entry )) {
            entry = { [ entry ]: [ entry ] };
        }
        if ( isArray( entry )) {
            entry = mapKeys( entry, pickFirst );
        }
        if ( isPlainObject( entry )) {
            return mapValues( entry, ensureArray );
        }
        return {};
    },

    constructUrl = ({ host, port }) => `http://${ host }${port ? `:${port}` : ''}`
;
