var mFirst_original = require( './lib/maleNames' );
var fFirst_original = require( './lib/femaleNames' );
var aFirst_original = require( './lib/ambiguousNames' );
var last_original = require( './lib/last_names' );
var mFirst;
var fFirst;
var aFirst;
var last;

// RC: better first name source --> https://www.ssa.gov/OACT/babynames/limits.html
// RC: better last name source --> https://www.census.gov/topics/population/genealogy/data.html

var _ = require( 'lodash' );

nr = {};
nr.debug = false;

nr.find = function ( txt, config )
{
	var requireCapitalized = _.get( config, 'capitalized' );
	var requireUnique = _.get( config, 'unique' );
	var top = _.get( config, 'top' );
	if ( ! top ) { top = 0.85; }
	mFirst = nr.getTopNames( mFirst_original, top );
	fFirst = nr.getTopNames( fFirst_original, top );
	aFirst = nr.getTopNames( aFirst_original, top );
	last = nr.getTopNames( last_original, top );
	var names = [];
	var splits = nr.splitOnCommonDivisions( txt );
	_.each( splits, ( split, splitIdx ) =>
	{
		var firstName = null;
		var gender = null;
		var words = nr.words( split );
		var idx = null;

		var lastNameMatchCheck = function ( possibleLastName, possibleLastNameIdx, pl )
		{
			if ( nr.debug ) console.log( '>> last ->', possibleLastName );
			if ( last.includes( pl ) )
			{
				var capitalized = ( nr.isCapitalized( possibleLastName ) && nr.isCapitalized( firstName ) );
				var f = firstName.join( ' ' );
				var n = f + ' ' + possibleLastName;
				var nLower = n.toLowerCase();
				var unique = ( _.findIndex( names, { nameLowerCase : nLower } ) == -1 );
				if ( ! requireCapitalized || capitalized )
				{
					if ( ! requireUnique || unique )
					{
						names.push(
						{
							first: f,
							last: possibleLastName,
							gender: gender,
							position: 
							{
								word: possibleLastNameIdx - firstName.length,
								wordGroup: splitIdx
							},
							name: n,
							nameLowerCase: nLower,
							capitalized: capitalized
						});
						if ( nr.debug ) console.log( '***', _.last( names ) );
						return true;
					}
				}
			}
			return false;
		};

		_.each( words, ( word, wordIdx ) =>
		{
			idx = wordIdx;
			var w = word.toLowerCase();
			if ( ! firstName )
			{
				var possibleGender = nr.firstNameMatch( w );
				if ( possibleGender )
				{
					firstName = [ word ];
					gender = possibleGender;
					if ( nr.debug ) console.log( '>> first ->', word, possibleGender );
				} else {
					firstName = null;
				}
			} else {
				var possibleGender = nr.firstNameMatch( w );
				if ( possibleGender )
				{
					if ( nr.debug ) console.log( '>> first ->', word, possibleGender );
					firstName.push( word );
				} else {

					if ( nr.debug ) console.log( '#1' );

					if ( ! lastNameMatchCheck( word, wordIdx, w ) && firstName.length > 1 )
					{
						word = firstName.pop();
						w = word.toLowerCase();
						if ( nr.debug ) console.log( '#2' );
						lastNameMatchCheck( word, wordIdx - 1, w );
					}
					firstName = null;
				}
			}
		});

		if ( firstName && firstName.length > 1 )
		{
			word = firstName.pop();
			w = word.toLowerCase();
			if ( nr.debug ) console.log( '#3' );
			lastNameMatchCheck( word, idx - 1, w );
		}
	});
	return names;
};

nr.getTopNames = function ( obj, percent )
{
	percent *= 100;
	var arr = [];
	_.each( obj, ( v, k ) =>
	{
		if ( v > percent )
		{
			return false;
		}
		arr.push( k );
	});
	return arr;
};

nr.firstNameMatch = function ( w )
{
	var gender = null;
	if ( mFirst.includes( w ) )
	{
		gender = 'male';
	} else if ( fFirst.includes( w ) ) {
		gender = 'female';
	} else if ( aFirst.includes( w ) ) {
		gender = 'unknown';
	}
	return gender;
};

nr.splitOnCommonDivisions = function ( txt )
{
	return txt.match( /[^\n\r,.?!]+/g );
};

nr.words = function ( txt )
{

	return _.words( txt, /[^, ]+/g );
};

nr.isCapitalized = function ( w )
{
	if ( _.isArray( w ) )
	{
		var capitalized = true;
		_.each( w, p =>
		{
			if ( ! nr.isCapitalized( p ) )
			{
				capitalized = false;
				return false;
			}
		});
		return capitalized;
	} else {
		return ( w.charAt( 0 ).toUpperCase() == w.charAt( 0 ) );
	}
};

module.exports = nr;