/* 
 * This is a source file for UnitJS a unit testing framework
 * for javascript.
 * Copyright (C) 2009 Daniel Bush
 * This program is distributed under the terms of the GNU
 * General Public License.  A copy of the license should be
 * enclosed with this project in the file LICENSE.  If not
 * see <http://www.gnu.org/licenses/>.
 *
 * Substantial parts of this code were taken from the JSUnit
 * project.  The Initial Developer of the Original Code is
 * Edward Hieatt, edward@jsunit.net.  Portions created by
 * the Initial Developer are Copyright (C) 2003 the Initial
 * Developer.  All Rights Reserved.
 *
 */


$web17_com_au$.unitJS.printers = function() {

  var module={};

  // Increment and use for generating id's.

  var sequencer=0;

  // DefaultPrinter
  //
  // Prints results of tests into an html document.
  //
  // parentNode: the parent node we should attach our results to.
  // id        : you must specify this if you are invoking DefaultPrinter
  //             in a recursive or nested context (multiple instances on
  //             the one DOM); 
  //             Increment and use 'sequencer' (in this module) to generate a unique id.
  //             If id is NOT supplied, DefaultPrinter will assume id='tests' and 
  //             will first search and destroy any such element.
  // label     : Optional description that will be shown at the top before the tests.
  // tests_div : div that contains test results
  // test_div  : div that contains individual test result
  // 

  module.DefaultPrinter = function(parentNode,id,label) {

    var me = this;
    var tests_div;

    if(!id) {
      // Delete 'tests' div if already in DOM...
      tests_div=document.getElementById("tests");
      if ( tests_div ) {
        parentNode.removeChild(tests_div);
      }
      // Create 'tests' div...
      tests_div=document.createElement('DIV');
      tests_div.id = "tests";
      parentNode.appendChild( tests_div );
    } else {
      tests_div=document.createElement('DIV');
      tests_div.id = id;
      tests_div.className = 'subsection';
      parentNode.appendChild( tests_div );
    }
    if(label) {
      tests_div.appendChild(tag('P',label));
    }
    var stats_container_div=document.createElement('DIV');
    stats_container_div.className = "stats-container";
    tests_div.appendChild(stats_container_div);

    // Create a section div, run the tests and append
    // to this div instead of directly to tests_div.

    me.subsection_printer = function(name) {
      return new module.DefaultPrinter(tests_div,'section-'+(sequencer++),name);
    }


    me.printPass = function(num,test_name,stats) {
      var test_div=document.createElement('DIV');
      var t=tag('P',num+': '+test_name+'... ');
      test_div.className = 'test';
      t.appendChild(passed());
      test_div.appendChild(t);
      tests_div.appendChild(test_div);
    }

    me.printFail  = function(num,test_name,stats,e) {
      var test_div=document.createElement('DIV');
      var t=tag('P',num+': '+test_name+'... ');
      test_div.className = 'test';
      t.appendChild(failed());
      test_div.appendChild(t);
      test_div.appendChild(tag('P',
        "Failure on assertion #"+stats.current.assertion_count+'. '+e.message));
      if ( e.comment )
        test_div.appendChild(tag('P',"Comment: "+e.comment));
      if ( e.stack ) // Firefox when throwing 'new Error(msg)':
        test_div.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));
      tests_div.appendChild(test_div);
    }

    me.printError = function(num,test_name,stats,e) {
      var test_div=document.createElement('DIV');
      var t=tag('P',num+': '+test_name+'... ');
      test_div.className = 'test';
      t.appendChild(errored());
      test_div.appendChild(t);
      test_div.appendChild(tag('P',
        "Error occurred on or after assertion #"+stats.current.assertion_count));
      test_div.appendChild(tag('P',"Error message: "+e.message));
      if ( e.stack ) // Firefox when throwing 'new Error(msg)':
        test_div.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));
      tests_div.appendChild(test_div);
    }

    me.printStats = function(stats) {
      var stats_div = document.createElement('DIV');
      stats_div.className = 'stats';
      stats_container_div.appendChild(stats_div);
      stats_div.innerHTML = 
        'Tests: '+stats.tests+'<br/>'+
        'Tests - Failed: '+stats.failed_tests+'<br/>'+
        'Tests - Errors: '+stats.errored_tests+'<br/>'+
        'Assertions: '+stats.assertions+'<br/>';
    }

    me.printSectionStats = function(stats) {
      var stats_div = document.createElement('DIV');
      stats_div.className = 'section-stats';
      stats_container_div.appendChild(stats_div);
      stats_div.innerHTML = 
        'Tests: '+stats.section.tests+'<br/>'+
        'Tests - Failed: '+stats.section.failed_tests+'<br/>'+
        'Tests - Errors: '+stats.section.errored_tests+'<br/>'+
        'Assertions: '+stats.section.assertions+'<br/>';
    }


    // Helper functions to create tags:

    function tag(tagType,text) {
      var p=document.createElement(tagType);
      var ptext=document.createTextNode(text);
      p.appendChild(ptext);
      return p;
    }

    function passed() {
      var span=tag('SPAN',"PASSED");
      span.style.color="green";
      span.style.fontWeight="bold";
      return span;
    }

    function failed() {
      var span=tag('SPAN',"FAILED");
      span.style.color="red";
      span.style.fontWeight="bold";
      return span;
    }

    function errored() {
      var span=tag('SPAN',"ERROR!");
      span.style.color="white";
      span.style.backgroundColor="red";
      span.style.fontWeight="bold";
      return span;
    }

  }

  return module;

}();
