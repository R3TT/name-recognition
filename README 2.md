timeloop.js
=========

timeloop.js tracks the current time, deltaTime and related data. You can query it at any time. This is more appropriate for games, simulations, virtual worlds, visualizations, etc. than using a strictly event oriented system.

You can also subscribe to timing events. For instance, this is useful for creating a simple update
loop.

by Rett Crocker

## Installation

  npm install timeloop

## Usage

  var timeloop = require('../lib/timeloop');

  var tester = tester || {};

  tester.loop = function ( )
  {
    console.log( 'time =', timeloop.time );
    console.log( 'deltaTime =', timeloop.deltaTime );
  };

  timeloop.subscribe('tester', tester.loop, 1.0);

## Release History

* 2013 - version 1.0.1
  * original version
* 2014 - version 1.1.1
  * updated to support node and to act as a simple node module
* 2015 - version 1.2.1
  * updated to be a true node module with support for npm
* 2015 - version 1.2.3
  * added link to github repo
* 2016 - version 1.3.3
  * switched to setInterval rather than setTimeout (memory leak under certain conditions)