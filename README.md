# name-recognition
name-recognition is a library for finding all human names in an arbitrary piece of text. The library is currently very USA-centric since the initial set of names came from the most common names in the USA (male, female, ambiguous, and surnames).

by Rett Crocker

## Installation

`npm install name-recognition`

## Usage

```var nr = require( 'name-recognition' );
var txt = 'The county municipal building on Monroe Avenue is named for former County Executive Edwin Michaels and county-owned Allen park in Somers is named to memorialize former County Executive Alfred DelCampo. Edwin Michaels is currently retired and living in South Palmetto County.';
var namesFound;
namesFound = nr.find( txt );
// returns 4 names
// Edwin Michaels, Allen park, Alfred DelCampo, Edwin Michaels

namesFound = nr.find( txt, { capitalized : true, unique : true } );
// returns 2 names
// Edwin Michaels, Alfred DelCampo
```

## Release History

* 2018.06.14 - version 1.0.4
  * initial fixes
* 2018.06.14 - version 1.0.1
  * original version
* 2018.06.19
  * Adding to npm