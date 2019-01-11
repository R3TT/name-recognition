var nr = require( '../index' );
var strings = require( './test-strings' );
var top = 0.85;

var runTests = function ( p, x )
{
	console.log( '** Running tests using the top ' + ( p * 100 ) + '% of names' );
	console.log( '-- 50 random names -------------------------------' );
	var randomNames = nr.find( strings.listOfNames, { capitalized : true, unique : true, top : p } );
	console.log( randomNames.length + ' names found out of 50 (' + x[ 0 ] + ' expected)' );
	console.log( '--' );

	console.log( '-- 2 long bios -----------------------------------' );
	var bios = nr.find( strings.paragraphs, { capitalized : true, unique : true, top : p } );
	console.log( bios.length + ' names found out of 2 (' + x[ 1 ] + ' expected)' );
	console.log( '--' );

	console.log( '-- 28 contact cards (with some markup) -----------' );
	var contactCards = nr.find( strings.markup, { capitalized : true, unique : true, top : p } );
	console.log( contactCards.length + ' names found out of 28 (' + x[ 2 ] + ' expected)' );
	console.log( '--' );
	console.log( '\n' );
};

console.log( '\n' );

runTests( 0.75, [ 44, 2, 24 ] );
runTests( 0.85, [ 50, 3, 27 ] );
runTests( 0.95, [ 50, 3, 29 ] );

console.log( '85% seems to be the sweet spot.' );
console.log( '\n' );
