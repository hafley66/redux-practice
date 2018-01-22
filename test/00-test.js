const one = require( '../src/01-resolve' );
const two = require( '../src/02-paths' );
const three = require( '../src/03-load-caches' );
const four = require( '../src/04-register-expansions' );
const five = require( '../src/05-run-expansions' );

const x1 = one( './test/00-test.yaml' );
const x2 = two( x1 );
const x3 = three( x2 );
const x4 = four( x3 );
const x5 = five( x4 );
x5.then( x => {
    console.log( x.meta.assets());
    'yolo';
});
