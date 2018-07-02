var fs = require( 'fs' );
var _ = require( 'lodash' );

var lastNames = require( '../lib/lastnames' );
var maleFirstNames = require( '../lib/maleNames' );
var femaleFirstNames = require( '../lib/femaleNames' );
var ambigFirstNames = require( '../lib/ambiguousNames' );

// 1990 Census last names
var process = function ()
{
	processLastNames();
	processFirstNames();
};

var processLastNames = function ()
{
	processFile( './last_names/Names_1990Census-dist.all.last.txt', lastNames, 'FIRST_WORD' );
	processFile( './last_names/Names_2000Census-app_c.csv', lastNames, 'SPLIT_COMMA' );
	processFile( './last_names/Names_2010Census.csv', lastNames, 'SPLIT_COMMA' );
	lastNames.sort();
	lastNames = _.uniq( lastNames );
	outputFile( lastNames, './lastNames.js' );
};

var processFirstNames = function ()
{
	var isFemaleName = function ( words )
	{
		return ( words[ 1 ] == 'F' );
	};

	processFile( './Names_1990Census-dist.female.first.txt', femaleFirstNames, 'FIRST_WORD' );
	processFile( './Names_1990Census-dist.male.first.txt', maleFirstNames, 'FIRST_WORD' );
	for ( var year = 1880; year < 2018; year++ )
	{
		processFile( './first_names/yob' + year + '.txt',
		{
			arr1 : femaleFirstNames, 
			arr2 : maleFirstNames, 
			switchFunction : isFemaleName 
		}, 'SPLIT_AND_FILTER' );
	}
	ambigFirstNames = ambigFirstNames.concat( _.intersection( femaleFirstNames, maleFirstNames ) );
	maleFirstNames = _.difference( maleFirstNames, ambigFirstNames );
	femaleFirstNames = _.difference( femaleFirstNames, ambigFirstNames );
	outputFile( femaleFirstNames, './femaleNames.js' );
	outputFile( maleFirstNames, './maleNames.js' );
	outputFile( ambigFirstNames, './ambiguousNames.js' );
};

var processFile = function ( f, arr, method )
{
	var fileData = getFileAsLines( f );
	if ( method == 'FIRST_WORD' )
	{
		processFileUsingFirstWord( fileData, arr );
	} else if ( method == 'SPLIT_COMMA' ) {
		processFileUsingSplitComma( fileData, arr );
	} else if ( method == 'SPLIT_AND_FILTER' ) {
		processFileUsingSplitAndFilter( fileData, arr.arr1, arr.arr2, arr.switchFunction );
	}
};

var processFileUsingFirstWord = function ( fileData, arr )
{
	_.each( fileData, ( d, idx ) =>
	{
		if ( idx < 1 ) return;
		if ( idx == ( fileData.length - 1 ) ) return;
		var w = _.words( d );
		var surname = w[ 0 ].toLowerCase()
		if ( idx % 10000 == 0 )
		{
			console.log( idx + '/' + fileData.length + '-->' + surname );
		}
		arr.push( surname );
	});
};

var processFileUsingSplitComma = function ( fileData, arr )
{
	_.each( fileData, ( d, idx ) =>
	{
		if ( idx < 1 ) return;
		if ( idx == ( fileData.length - 1 ) ) return;
		var w = d.split( ',' );
		var surname = w[ 0 ].toLowerCase()
		if ( idx % 10000 == 0 )
		{
			console.log( idx + '/' + fileData.length + '-->' + surname );
		}
		arr.push( surname );
	});
};

var processFileUsingSplitAndFilter = function ( fileData, arr1, arr2, switchFunction )
{
	_.each( fileData, ( d, idx ) =>
	{
		if ( idx < 1 ) return;
		if ( idx == ( fileData.length - 1 ) ) return;
		var w = d.split( ',' );
		var surname = w[ 0 ].toLowerCase()
		if ( idx % 10000 == 0 )
		{
			console.log( idx + '/' + fileData.length + '-->' + surname );
		}
		if ( switchFunction( w ) )
		{
			arr1.push( surname );
		} else {
			arr2.push( surname );
		}
	});
};

var getFileAsLines = function ( f )
{
	console.log( 'Reading file', f );
	var data = fs.readFileSync( f, 'utf8' );
	console.log( 'done...' );
	console.log( 'Splitting file into lines' );
	var arr = data.split( '\n' );
	console.log( 'done...' );
	return arr;
};

var outputFile = function ( arr, f )
{
	arr.sort();
	arr = _.uniq( arr );
	var txt = JSON.stringify( arr, null, '\t' );
	txt = 'module.exports = ' + txt + ';';
	fs.writeFileSync( f, txt );
	console.log( 'Unique', f, arr.length );
};

process();