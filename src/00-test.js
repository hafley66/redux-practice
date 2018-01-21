const one = require( './01-resolve' );
const two = require( './02-paths' );
const three = require( './03-load-caches' );
const four = require( './04-register-expansions' );
const five = require( './05-run-expansions' );

const x1 = one( './00-test.yaml' );
console.log( x1.entry );
const x2 = two( x1 );
console.log( x2.entry );
const x3 = three( x2 );
console.log( x3.entry );
const x4 = four( x3 );
console.log( x4.meta.absolutePublicPath );
const x5 = five( x4 );
console.log( x5.plugins );
debugger;
