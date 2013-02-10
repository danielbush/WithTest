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
  var data       = $dlb_id_au$.unitJS.data;
  var utils      = $dlb_id_au$.unitJS.utils;
  var doTest     = $dlb_id_au$.unitJS.assertions.doTest;
  var STATE      = $dlb_id_au$.unitJS.data.testStates;

  // Assumption here is that each 'item' in 'tests' will be passed to
  // this function in order and we can accumulate information in
  // 'tests'.
  //
  // If item is 'test', then increment the relevant counter in
  // tests.stats and tests.cumulative with the test outcome.
  // If item is 'tests', then add this to tests.cumulative.

  var doItem = function(tests,item) {
    if(!tests.stats) {
      tests.stats = data.makeStats();
    }
    if(!tests.cumulative) {
      tests.cumulative = data.makeStats();
    }
    if(item.type == 'test') {
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
      case STATE.NOTEST:
        tests.stats.not_implemented++;
        tests.cumulative.not_implemented++;
        break;
      case STATE.NOASSERTIONS:
        tests.stats.no_assertions++;
        tests.cumulative.no_assertions++;
        break;
      };
    }
    if(item.type == 'tests') {
      tests.cumulative.pass += item.cumulative.pass;
      tests.cumulative.fail += item.cumulative.fail;
      tests.cumulative.error += item.cumulative.error;
      tests.cumulative.not_implemented += item.cumulative.not_implemented;
      tests.cumulative.no_assertions += item.cumulative.no_assertions;
    }
  };

  // Run tests, recursing as required.

  module.run = function(tests) {
    utils.treewalk(tests,doTest,doItem);
    return tests;
  };

  return module;

}();
