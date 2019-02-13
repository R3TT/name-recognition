# name-recognition
name-recognition is a library for finding all human names in an arbitrary piece of text. The library is currently very USA-centric since the initial set of names came from the most common names in the USA (male, female, ambiguous, and surnames).

by Rett Crocker

## Installation

`npm install name-recognition`

## Usage

```
var nr = require( 'name-recognition' );
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

* 2019.02.13 - version 1.3.1
  * Speeding up top names and added caching
* 2019.01.11 - version 1.2.1
  * Merged changes to add support for initials (thanks https://github.com/MatthewCrocker7)
* 2018.07.02 - version 1.1.4
  * Default to top 85% of names by occurence in population
* 2018.07.02 - version 1.1.3
  * Finalized support for specifying the popularity of the names required 
* 2018.07.02 - version 1.1.1
  * Added much larger library of names and ability to specify popularity requirements
* 2018.06.20 - version 1.0.7 
  * Changed license dates
* 2018.06.19 - version 1.0.6
  * Adding to npm
* 2018.06.14 - version 1.0.4
  * initial fixes
* 2018.06.14 - version 1.0.1
  * original version