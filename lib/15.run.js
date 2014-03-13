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

// This module contains code for running tests and assembling stats.

$dlb_id_au$.unitJS.run = function() {

  var module = {};
  var data         = $dlb_id_au$.unitJS.data;
  var utils        = $dlb_id_au$.unitJS.utils;
  var doTest       = $dlb_id_au$.unitJS.assertions.doTest;
  var STATE        = $dlb_id_au$.unitJS.data.testStates;
  var testLifetime = $dlb_id_au$.unitJS.testLifetime;
  var assertions   = $dlb_id_au$.unitJS.assertions;
  var shoulds      = $dlb_id_au$.unitJS.shoulds;

  // Run a test 'test' and update it.

  module.doTest = function(test,tests) {
    var caught = false;
    var setup = null, teardown = null;
    testLifetime.reset();
    if(!test.fn) {
      test.status = STATE.NOTIMPLEMENTED;
      return;
    }
    if(tests.setup) {
      setup = tests.setup();
    }
    try {
      test.fn.call(assertions,setup);
    }
    catch(e) {
      caught = true;
      test.message = e.message;  // js error message
      test.comment = e.comment;  // assertion comment from author
      test.stack = e.stack;
      if(e.isFailure) {
        test.status = STATE.FAIL;
        test.message += '. Failure on assertion:'+(testLifetime.assertions);
      }
      else {
        test.status = STATE.ERROR;
      }
    }
    if(tests.teardown) {
      teardown = tests.teardown(setup);
    }
    test.assertions = testLifetime.assertions;
    if(!caught) {
      if(test.assertions === 0) {
        test.status = STATE.NOTIMPLEMENTED;
      } else {
        test.status = STATE.PASS;
      }
    }
    else {
    }
  };



  // Assumption here is that each 'item' in 'tests' will be passed to
  // this function in order and we can accumulate information in
  // 'tests'.
  //
  // If item is 'test', then increment the relevant counter in
  // tests.stats and tests.cumulative with the test outcome.
  // If item is 'tests', then add this to tests.cumulative.

  var sweep = function(tests,item) {
    if(!tests.stats) {
      tests.stats = data.makeStats();
    }
    if(!tests.cumulative) {
      tests.cumulative = data.makeStats();
    }
    if(item.type == 'test') {
      tests.stats.tests++;
      tests.cumulative.tests++;
      tests.cumulative.assertions += item.assertions;
      switch(item.status) {
      case STATE.PASS:
        tests.stats.pass++;
        tests.cumulative.pass++;
        break;
      case STATE.FAIL:
        tests.stats.fail++;
        tests.cumulative.fail++;
        break;
      case STATE.ERROR:
        tests.stats.error++;
        tests.cumulative.error++;
        break;
      case STATE.NOTIMPLEMENTED:
        tests.stats.not_implemented++;
        tests.cumulative.not_implemented++;
        break;
      };
    }
    if(item.type == 'tests') {
      tests.cumulative.assertions += item.cumulative.assertions;
      tests.cumulative.pass += item.cumulative.pass;
      tests.cumulative.fail += item.cumulative.fail;
      tests.cumulative.error += item.cumulative.error;
      tests.cumulative.not_implemented += item.cumulative.not_implemented;
      tests.cumulative.tests += item.cumulative.tests;
    }
  };

  var postVisit = function(item) {
    if(item.type == 'tests') {
      // Favour errors then fails.
      // Then not_implemented.
      // Then passes.
      if(item.cumulative.error>0) {
        item.status = STATE.ERROR;
      }
      else if(item.cumulative.fail>0) {
        item.status = STATE.FAIL;
      }
      else if(item.cumulative.not_implemented>0) {
        item.status = STATE.NOTIMPLEMENTED;
      }
      else if(item.cumulative.pass>0) {
        item.status = STATE.PASS;
      }
      else {
        item.status = STATE.NOTIMPLEMENTED;
      }
    }
  };

  // Run tests, recursing as required.

  module.run = function(tests) {
    utils.treewalk(
      tests,
      function(item,tests){
        if(item.type=='test') {
          module.doTest(item,tests);
        }
      },
      sweep,
      postVisit
    );
    return tests;
  };

  return module;

}();
