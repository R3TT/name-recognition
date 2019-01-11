var nr = require("../index");
var results = nr.find( 'Charles Everett Crocker is my name', { capitalized : true, unique : true } );
for( var ii = 0; ii < results.length; ii++ )
{
    console.log( results[ ii ].name );
}
