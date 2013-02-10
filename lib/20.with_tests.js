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

// This module defines with_tests and with_tests$ functions that
// provide a convenient way to write tests.

$dlb_id_au$.unitJS.with$ = function() {

  var module = {};
  var data     = $dlb_id_au$.unitJS.data;
  var run      = $dlb_id_au$.unitJS.run.run;

  // Generate a 'tests' data structure of tests (nested 'tests' and
  // 'test' data structures).
  //
  // The tests are not executed.

  module.with_tests$ = function(name,fn,tests) {
    if(!tests) {
      tests = data.makeTests();
    }
    var o = {
      tests:function(testsName,fn) {
        var nestedTests = data.makeTests();
        nestedTests.name = testsName;
        tests.items.push(nestedTests);
        module.with_tests$(nestedTests.name,fn,nestedTests);
      },
      test:function(testName,fn) {
        var test = data.makeTest();
        test.test = testName;
        test.fn = fn;
        tests.items.push(test)
      }
    };
    fn(o);
    return tests;
  };

  // Run module.with_test$ and execute the tests.

  module.with_tests = function(name,fn) {
    var tests = module.with_tests$(name,fn);
    return run(tests);
  };


  return module;

}();
