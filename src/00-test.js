const one = require( './01-resolve' );
const two = require( './02-paths' );
const three = require( './03-load-caches' );
const four = require( './04-register-expansions' );
const five = require( './05-run-expansions' );

const x1 = one( './src/00-test.yaml' );
const x2 = two( x1 );
const x3 = three( x2 );
const x4 = four( x3 );
const x5 = five( x4 );
x5.then( x => {
    console.log( x.meta.manifests.assets );
});
