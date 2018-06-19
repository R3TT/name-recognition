var mFirst = require( './lib/maleNames' );
var fFirst = require( './lib/femaleNames' );
var aFirst = require( './lib/ambiguousNames' );
var last = require( './lib/lastnames' );

var _ = require( 'lodash' );

nr = {};
nr.debug = false;

nr.find = function ( txt, requireCapitalized, requireUnique )
{
	var names = [];
	var lines = nr.lines( txt );
	_.each( lines, ( line, lineIdx ) =>
	{
		var firstName = null;
		var gender = null;
		var words = nr.words( line );
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
				if ( requireCapitalized && capitalized )
				{
					if ( requireUnique && unique )
					{
						names.push(
						{
							first: f,
							last: possibleLastName,
							gender: gender,
							position: 
							{
								row: possibleLastNameIdx - firstName.length,
								column: lineIdx
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

nr.lines = function ( txt )
{
	return txt.match( /[^\r\n]+/g );
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