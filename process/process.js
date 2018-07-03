var fs = require( 'fs' );
var _ = require( 'lodash' );

var lastNames = {};
var maleFirstNames = {};
var femaleFirstNames = {};
var ambigFirstNames = {};

var process = function ()
{
	processLastNames();
	processFirstNames();
};

var processLastNames = function ()
{
	processFile( './last_names/Names_1990Census-dist.all.last.txt', lastNames, '1990_CENSUS' );
	processFile( './last_names/Names_2000Census-app_c.csv', lastNames, '2000_2010_CENSUS' );
	processFile( './last_names/Names_2010Census.csv', lastNames, '2000_2010_CENSUS' );
	outputFile( lastNames, './lastNames.js' );
};

var processFirstNames = function ()
{
	var isFemaleName = function ( words )
	{
		return ( words[ 1 ] == 'F' );
	};

	processFile( './Names_1990Census-dist.female.first.txt', femaleFirstNames, '1990_CENSUS' );
	processFile( './Names_1990Census-dist.male.first.txt', maleFirstNames, '1990_CENSUS' );
	// RC: note that this data gets a bit skewed due to the fact that there aren't any people
	//     still alive that were born in 1880, but we're still counting their names
	for ( var year = 1950; year < 2018; year++ )
	{
		processFile( './first_names/yob' + year + '.txt',
		{
			obj1 : femaleFirstNames, 
			obj2 : maleFirstNames, 
			switchFunction : isFemaleName 
		}, 'SPLIT_AND_FILTER' );
	}
	console.log( 'Finding ambiguous first names' );
	var femaleToRemove = [];
	var maleToRemove = [];
	_.each( maleFirstNames, ( v, k ) =>
	{
		if ( femaleFirstNames.hasOwnProperty( k ) )
		{
			var femaleCalc = getCalcInArray( femaleFirstNames[ k ], [ 'avg', 'max', 'min' ] );
			var maleCalc = getCalcInArray( maleFirstNames[ k ], [ 'avg', 'max', 'min' ] );
			var diff = Math.abs( femaleCalc.avg - maleCalc.avg );
			// if ( k == 'aaron' )
			// {
			// 	console.log( '****************************************' );
			// 	console.log( 'aaron:', diff );
			// 	console.log( '- f:', femaleCalc );
			// 	console.log( '- m:', maleCalc );
			// }
			if ( diff < 20 )
			{
				ambigFirstNames[ k ] = femaleFirstNames[ k ].concat( maleFirstNames[ k ] );
				maleToRemove.push( k );
				femaleToRemove.push( k );
			} else if ( femaleCalc.avg < maleCalc.avg ) {
				maleToRemove.push( k );
			} else {
				femaleToRemove.push( k );
			}
		}
	});
	console.log( 'Found', _.size( ambigFirstNames ) );
	var pickKeys;
	pickKeys = _.difference( _.keys( femaleFirstNames ), femaleToRemove );
	femaleFirstNames = _.pick( femaleFirstNames, pickKeys );
	pickKeys = _.difference( _.keys( maleFirstNames ), maleToRemove );
	maleFirstNames = _.pick( maleFirstNames, pickKeys );
	outputFile( femaleFirstNames, './femaleNames.js' );
	outputFile( maleFirstNames, './maleNames.js' );
	outputFile( ambigFirstNames, './ambiguousNames.js' );
};

var processFile = function ( f, obj, method )
{
	var fileData = getFileAsLines( f );
	if ( method == '1990_CENSUS' )
	{
		processFileUsing1990CensusFormat( fileData, obj );
	} else if ( method == '2000_2010_CENSUS' ) {
		processFileUsing2000And2010CensusFormat( fileData, obj );
	} else if ( method == 'SPLIT_AND_FILTER' ) {
		processFileUsingSplitAndFilter( fileData, obj.obj1, obj.obj2, obj.switchFunction );
	}
};

var processFileUsing1990CensusFormat = function ( fileData, obj )
{
	_.each( fileData, ( d, idx ) =>
	{
		if ( idx < 1 ) return;
		if ( idx == ( fileData.length - 1 ) ) return;
		var w = _.words( d, /[^, ]+/g );
		var surname = w[ 0 ].toLowerCase();
		var cumulativePercent = w[ 2 ].toLowerCase() * 1.0;
		if ( idx % 10000 == 0 )
		{
			console.log( idx + '/' + fileData.length + '-->' + surname, cumulativePercent );
		}
		if ( ! obj.hasOwnProperty( surname ) )
		{
			obj[ surname ] = [];
		}
		obj[ surname ].push( cumulativePercent );
	});
};

var processFileUsing2000And2010CensusFormat = function ( fileData, obj )
{
	_.each( fileData, ( d, idx ) =>
	{
		if ( idx < 1 ) return;
		if ( idx == ( fileData.length - 1 ) ) return;
		var w = d.split( ',' );
		var surname = w[ 0 ].toLowerCase();
		var cumulativePercent = w[ 4 ].toLowerCase() / 1000;
		if ( idx % 10000 == 0 )
		{
			console.log( idx + '/' + fileData.length + '-->' + surname, cumulativePercent );
		}
		if ( ! obj.hasOwnProperty( surname ) )
		{
			obj[ surname ] = [];
		}
		obj[ surname ].push( cumulativePercent );
	});
};

var processFileUsingSplitAndFilter = function ( fileData, obj1, obj2, switchFunction )
{
	var total1 = 0;
	var total2 = 0;
	_.each( fileData, ( d, idx ) =>
	{
		if ( idx < 1 ) return;
		if ( idx == ( fileData.length - 1 ) ) return;
		var w = d.split( ',' );
		if ( switchFunction( w ) )
		{
			total1 += w[ 2 ] * 1;
		} else {
			total2 += w[ 2 ] * 1;
		}
	});
	// assume total is actually only 91% of the population
	total1 = Math.floor( total1 / 0.91 );
	total2 = Math.floor( total2 / 0.91 );
	var num1 = 0;
	var num2 = 0;
	_.each( fileData, ( d, idx ) =>
	{
		if ( idx < 1 ) return;
		if ( idx == ( fileData.length - 1 ) ) return;
		var w = d.split( ',' );
		var name = w[ 0 ].toLowerCase();
		var num = w[ 2 ] * 1;
		var temp_obj, temp_total, temp_num;
		if ( switchFunction( w ) )
		{
			temp_obj = obj1;
			temp_total = total1;
			num1 += num;
			temp_num = num1;
		} else {
			temp_obj = obj2;
			temp_total = total2;
			num2 += num;
			temp_num = num2;
		}
		if ( ! temp_obj.hasOwnProperty( name ) )
		{
			temp_obj[ name ] = [];
		}
		var cumulativePercent = ( temp_num / temp_total ) * 100;
		if ( idx % 5000 == 0 )
		{
			console.log( idx + '/' + fileData.length + '-->' + name, cumulativePercent );
		}
		temp_obj[ name ].push( cumulativePercent );
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

var outputFile = function ( obj, f )
{
	console.log( 'Averaging percentages' );
	var arr = [];
	_.each( obj, ( v, k ) =>
	{
		var avg = 0;
		var min = 100;
		for ( var ii = 0; ii < v.length; ii++ )
		{
			avg += v[ ii ];
			if ( v[ ii ] < min )
			{
				min = v[ ii ];
			}
		}
		avg = avg / v.length;
		arr.push(
		{
			name : k,
			percent : avg,
			minimum : min
		});
	});
	console.log( 'done...' );
	// console.log( 'Sorting by percentage' );
	// arr = _.sortBy( arr, 'percent' );
	console.log( 'Sorting by minimum percentage' );
	arr = _.sortBy( arr, 'minimum' );
	var obj = {};
	_.each( arr, o =>
	{
		obj[ o.name ] = o.minimum;
	});
	console.log( 'done...' );
	var txt = JSON.stringify( obj, null, '\t' );
	txt = 'module.exports = ' + txt + ';';
	fs.writeFileSync( f, txt );
	console.log( 'Unique', f, arr.length );
};

var getCalcInArray = function ( arr, type )
{
	var avg = 0;
	var min = Number.MAX_SAFE_INTEGER;
	var max = Number.MIN_SAFE_INTEGER;
	for ( var ii = 0; ii < arr.length; ii++ )
	{
		avg += arr[ ii ];
		if ( arr[ ii ] < min )
		{
			min = arr[ ii ];
		}
		if ( arr[ ii ] > max )
		{
			max = arr[ ii ];
		}
	}
	avg = avg / arr.length;
	obj = 
	{
		avg : avg,
		max : max,
		min : min
	}
	if ( _.isArray( type ) )
	{
		return _.pick( obj, type );
	} else {
		return obj[ type ];
	}
};

process();