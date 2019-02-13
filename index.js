var mFirst_original = require( './lib/maleNames' );
var fFirst_original = require( './lib/femaleNames' );
var aFirst_original = require( './lib/ambiguousNames' );
var last_original = require( './lib/last_names' );
var mFirst;
var fFirst;
var aFirst;
var last;

var cache = {};

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
	if ( _.has( cache, top ) )
	{
		mFirst = cache[ top ].mFirst;
		fFirst = cache[ top ].fFirst;
		aFirst = cache[ top ].aFirst;
		last = cache[ top ].last;
	} else {
		mFirst = nr.getTopNames( mFirst_original, top );
		fFirst = nr.getTopNames( fFirst_original, top );
		aFirst = nr.getTopNames( aFirst_original, top );
		last = nr.getTopNames( last_original, top );
		cache[ top ] = {};
		cache[ top ].mFirst = mFirst;
		cache[ top ].fFirst = fFirst;
		cache[ top ].aFirst = aFirst;
		cache[ top ].last = last;
	}
	var names = [];
	var splits = nr.splitOnCommonDivisions( txt );

	//console.log(splits);

	_.each( splits, ( split, splitIdx ) =>
	{
		var words = nr.words( split );

		var nameConfig = function(firstName, middleName, lastName, gender, index)
		{
			var fullName;
			var capitalized;

			if(middleName){
				fullName = firstName + ' ' + middleName + ' ' + lastName;
				capitalized = ( nr.isCapitalized( lastName ) && nr.isCapitalized( firstName ) && nr.isCapitalized( middleName ));
			}
			else {
				fullName = firstName + ' ' + lastName;
				capitalized = ( nr.isCapitalized( lastName ) && nr.isCapitalized( firstName ));
			}


			var unique = ( _.findIndex( names, { nameLowerCase : fullName.toLowerCase() } ) == -1 );

			if( !requireCapitalized || capitalized){
				if(	!requireUnique || unique ){
					//console.log(fullName);
					return {
						first: firstName,
						middle: middleName,
						last: lastName,
						gender: gender,
						position:
						{
							word: index,
							wordGroup: splitIdx
						},
						name: fullName,
						nameLowerCase: fullName.toLowerCase(),
						capitalized: requireCapitalized
					};
				}
			}
			return null;
		}

		var isLastName = function(possibleLastName, lastNameIndex)
		{
			var w = possibleLastName.toLowerCase();

			if(last.includes(w)){
				return true;
			}
			return false;
		};

		var isMiddleInitial = function(possibleInitial)
		{
			var initial = null;

			if(possibleInitial.length == 2){
				initial = possibleInitial.match(/([A-Za-z]\.)/);
			}
			else if (possibleInitial.length == 1){
				initial = possibleInitial.match(/([A-Za-z]{1})/);;
			}

			if(initial){
				return true;
			}
			else {
				return false;
			}
		}

		_.each(words, (word, wordIdx) =>
		{
			var w = word.toLowerCase();
			var possibleLast = null;
			var possibleMiddle = null;
			var lastIndex = null;
			var result = null;

			var possibleGender = nr.firstNameMatch(w);

			if(possibleGender)	{//Possible first name detected

				if(wordIdx <= words.length-2) {
					//This condition checks if the next word is a possible last name
					lastIndex = wordIdx + 1;
					possibleLast = words[lastIndex];

					if(isLastName(possibleLast, lastIndex)){
						if(lastIndex < words.length-1){ //Checks for potential middle name
							if(isLastName(words[lastIndex+1], lastIndex+1)){
								possibleMiddle = possibleLast;
								possibleLast = words[lastIndex+1];
							}
						}

						result = nameConfig(word, possibleMiddle, possibleLast, possibleGender, wordIdx);
						if(result)
							names.push(result);
					}
					else if (possibleLast.length <= 2 && isMiddleInitial(possibleLast) && wordIdx <= words.length-3){
						//This condition checks for last names separated by a middle initial
						possibleMiddle = possibleLast;
						lastIndex = wordIdx + 2;
						possibleLast = words[lastIndex];

						if(isLastName(possibleLast, lastIndex))	{
							result = nameConfig(word, possibleMiddle, possibleLast, possibleGender, wordIdx);
							if(result)
								names.push(result);
						}
					}
				}
			}
/*			else if (isLastName(word, wordIdx) && wordIdx <= words.length-2){	//Possible first name not detected, check if the last name is first
				possibleLast = word;
				var possibleFirst = words[wordIdx + 1];
				w = possibleFirst.toLowerCase();

				possibleGender = nr.firstNameMatch(w);
				if(possibleGender){
					result = nameConfig(possibleFirst, possibleMiddle, possibleLast, possibleGender, wordIdx);
					if(result){
						names.push(result);
					}
				}
			} */
		});
	});
	return names;
};

nr.getTopNames = function ( obj, percent )
{
	percent *= 100;
	return _.filter( Object.keys( obj ), k => obj[ k ] <= percent );
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
	return txt.match( /((\s.\.)|([^\n\r(),.?!]))+/g);
};
//(\s.\.)
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
