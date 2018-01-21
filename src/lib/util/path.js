let path = require( 'path' );
let { isFunction } = require( 'lodash' );

let CoercePathFunction = fn => isFunction( fn ) && fn.toString !== Function.prototype.toString
    ? fn.toString()
    : fn;

let coerce = ( ...paths ) => paths.map( CoercePathFunction );

let P = pathFnAbstract( 'join' );


function pathFnAbstract( method, reduce = false ) {
    return function pathFn( ...names ) {
        let cNames = coerce( ...names );

        let fn,
            baseCase = () => ( path[ method ]( ...cNames )),
            inductionCase = () => ( ...more ) => (
                more.length
                    ? pathFn( ...cNames.concat( coerce( ...more )))
                    : reduce
                        ? pathFn( fn.toString())
                        : fn.toString()
            );

        fn = inductionCase();
        fn.toString = baseCase;
        return prototype( fn );
    };
}

let pathFn = P;

Object.assign( pathFn, {
    resolve:  pathFnAbstract( 'resolve' ),
    basename: pathFnAbstract( 'basename', true ),
    dirname:  pathFnAbstract( 'dirname', true )

});

function prototype( fn ) {
    fn.str = fn.toString;
    fn.inspect = () => `pathFn -> ${fn}`;
    fn.minus = otherFn => {
        let index = ( fn().indexOf( otherFn.toString()));
        if ( index !== -1 ) {
            let withoutOther = fn().replace( otherFn.toString(), '' );
            let wut =
            (
                index === 0
                    ? withoutOther.replace( /^(\/|\\)/, '' )
                    : withoutOther
            );
            return P( wut );
        }
        return fn;
    };
    fn.toDotPath = ( start = 0, end ) =>
        fn().split( /[\\/]/g ).slice( start, end ).filter( x => x ).join( '.' )
    ;

    return fn;
}

pathFn.r = pathFn.resolve;
pathFn.car = pathFn.basename;
pathFn.cdr = pathFn.dirname;
pathFn.cwd = pathFn.resolve( process.cwd());


module.exports = pathFn;
module.exports.CoercePathFunction = CoercePathFunction;
