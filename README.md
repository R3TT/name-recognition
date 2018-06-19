# name-recognition
name-recognition is a library for finding all human names in an arbitrary piece of text. The library is currently very USA-centric since the initial set of names came from the most common names in the USA (male, female, ambiguous, and surnames).

by Rett Crocker

## Installation

`npm install name-recognition`

## Usage

```var nr = require( '../index' );
var namesFound = nr.find( 'There are some names in this sentence: Dave Bowie, Fred Mercury, Michael Jagger.' );
console.log( namesFound );```

## Release History

* 2018.06.14 - version 1.0.1
  * original version
* 2018.06.19
  * Adding to npm