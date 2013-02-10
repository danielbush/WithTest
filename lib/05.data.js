/*
   This is a source file for UnitJS a unit testing framework
   for javascript.
   Copyright (C) 2009-2013 Daniel Bush
   This program is distributed under the terms of the GNU
   General Public License.  A copy of the license should be
   enclosed with this project in the file LICENSE.  If not
   see <http://www.gnu.org/licenses/>.
  
   Parts of this code relating to assertions were taken from the
   JSUnit project: Edward Hieatt, edward@jsunit.net Copyright (C) 2003
   All Rights Reserved.

*/

// Main data structures used in unitjs.

$dlb_id_au$.unitJS.data = function() {

  var module = {};

  module.testStates = {
    // All tests start out like this:
    UNTESTED:'UNTESTED',

    // If no test.fn is detected, set to this:
    NOTEST:'NOTEST',
    // If test is there but no assetions:
    NOASSERTIONS:'NOASSERTIONS',
    // If all assertions pass:
    PASS:'PASS',
    // If any assertion fails:
    FAIL:'FAIL',
    // If the test throws an error:
    ERROR:'ERROR'
  };

  // Main data structure.
  //
  // All unitjs installations will have a root 'tests' object.

  module.makeTests = function() {

    return {

      type:'tests',
      name:'unnamed section',

      // Can contain tests or test.

      items:[],

      // Stats.
      // 
      // Each 'tests' object will have 2 versions:
      // - one for test objects defined in items
      // - a cumulative one for test objects and the cumulative stats of
      //   tests objects in items.

      stats:null,
      cumulative:null

    };

  };

  // Make a test.
  //
  // test.fn stores the test.
  // test.fn will have 'this' set to the assertions module.
  // eg this.assert(...).

  module.makeTest = function() {
    return {
      type:'test',
      test:'unnamed test',
      // The number of assertions that were executed.
      assertions:0,
      // Status of the test after running.
      status:module.testStates.UNTESTED,
      // The actual test.
      fn:function(){},
    };
  };

  // Used for stats and cumulative stats.
  //
  // See makeTests.

  module.makeStats = function() {
    return {
      // Count of passes, fails, errors.
      pass:0,
      fail:0,
      error:0,
      tests:0,
      no_assertions:0,
      not_implemented:0
    };
  };

  return module;

}();