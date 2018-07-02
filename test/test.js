var nr = require( '../index' );
var strings = require( './test-strings' );

console.log( '-- 50 random names -------------------------------' );
var randomNames = nr.find( strings.listOfNames, { capitalized : true, unique : true, top : 0.8 } );
console.log( randomNames.length + ' names found out of 50' );
console.log( '--------------------------------------------------' );
console.log( '\n' );

console.log( '-- 2 long bios -----------------------------------' );
var bios = nr.find( strings.paragraphs, { capitalized : true, unique : true, top : 0.8 } );
console.log( bios.length + ' names found out of 2' );
console.log( '--------------------------------------------------' );
console.log( '\n' );

console.log( '-- 31 contact cards (with some markup) -----------' );
var contactCards = nr.find( strings.markup, { capitalized : true, unique : true, top : 0.8 } );
console.log( contactCards.length + ' names found out of 31 (29 expected)' );
console.log( '--------------------------------------------------' );
console.log( '\n' );