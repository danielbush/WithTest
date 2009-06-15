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

  // Does nothing - a blank implementation of the Printer interface.

  module.DummyPrinter = function(parentNode,label,nested) {
    var me = this;
    me.printPass = function(num,test_name,stats){};
    me.printFail = function(num,test_name,stats,e){};
    me.printError = function(num,test_name,stats,e){};
    me.printStats = function(stats){};
    me.section_printer = function(section_name){ 
      return me;
    };
    me.updateSectionStatus = function(stats){};
    me.reset = function(){};
  }

  // DefaultPrinter
  //
  // Prints results of tests into an html document.
  // It should be instantiated without nested (or nested=false).
  // The outer most div is given an id of 'tests'.
  //
  // nested     : If false (or not specified), the Printer assumes it
  //              is the outer most printer.  This is how the user
  //              should invoke it.
  //              section_printer() will set this flag to true.
  //
  //
  // tests_div : div that contains test results
  // test_div  : div that contains individual test result
  // 

  module.DefaultPrinter = function(parentNode,label,nested) {

    var me = this;
    var tests_frame_div;
    var banner_div;
    var menu_div;
    var title_div;
    var h2_div;
    var tests_div;
    var stats_container_div;

    // Delete 'tests' div if already in DOM...

    me.reset = function() {
      var tmp=document.getElementById("tests");
      if(tmp) {
        tmp.parentNode.removeChild(tmp);
      }
      build();
    }

    function build() {
      tests_frame_div = document.createElement('DIV');
      tests_div = document.createElement('DIV');
      stats_container_div=document.createElement('DIV');

      tests_frame_div.innerHTML = 
        '<div class="banner" ><div class="menu" ></div>'+
        '<div class="title" ><h2></h2></div><div class="clear"></div></div>';
      banner_div = tests_frame_div.firstChild;
      menu_div = banner_div.firstChild;
      title_div = banner_div.firstChild.nextSibling;
      h2_div = title_div.firstChild;

      if(!nested) {
        tests_frame_div.id = "tests";
        parentNode.appendChild( tests_frame_div );
      } else {
        tests_frame_div.className = 'section';
        parentNode.appendChild( tests_frame_div );
        tests_div.style.display='none';
      }
      if(label) {
        h2_div.innerHTML=label;
      }

      title_div.onclick = function() {
        tests_div.style.display=='none' ?
        tests_div.style.display='' :
        tests_div.style.display='none' ;
      };

      stats_container_div.className = "stats-container";
      tests_frame_div.appendChild(stats_container_div);

      tests_frame_div.appendChild(tests_div);
    }

    // When this printer is being instantiated we should check to see if we're
    // the main (!nested) printer or a section printer (nested) and reset or
    // build the html accordingly.

    if(nested)  build();
    if(!nested) me.reset();

    me.updateSectionStatus = function(stats) {
      var msg = ' (Tests:'+stats.section.tests+'; ';
      if(stats.section.failed_tests>0||stats.section.errored_tests) {
        msg+=' Fails: '+stats.section.failed_tests+' / Errors: '+stats.section.errored_tests+')';
        banner_div.className = "banner section-fail";
        h2_div.appendChild(document.createTextNode(msg));
      }
      else {
        msg+=' Passed)'
        banner_div.className = "banner section-pass";
        h2_div.appendChild(document.createTextNode(msg));
      }
    }

    me.section_printer = function(name) {
      return new module.DefaultPrinter(tests_div,name,true);
    }

    me.printPass = function(num,test_name,stats) {
      var test_div=document.createElement('DIV');
      var t=tag('SPAN',num+': '+test_name+'... ');
      test_div.className = 'test test-pass';
      test_div.appendChild(t);
      test_div.appendChild(passed());
      test_div.appendChild(clearing_div());
      tests_div.appendChild(test_div);
    }

    me.printFail  = function(num,test_name,stats,e) {
      var test_div=document.createElement('DIV');
      var t=tag('SPAN',num+': '+test_name+'... ');
      test_div.className = 'test test-fail';
      test_div.appendChild(t);
      test_div.appendChild(failed());
      test_div.appendChild(clearing_div());
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
      test_div.className = 'test test-error';
      test_div.appendChild(t);
      test_div.appendChild(errored());
      test_div.appendChild(clearing_div());
      if(stats.current.assertion_count==0) {
        test_div.appendChild(tag('P',
          "Error occurred before first assertion."));
      } else {
        test_div.appendChild(tag('P',
          "Error occurred on or after assertion #"+stats.current.assertion_count));
      }
      test_div.appendChild(tag('P',"Error message: "+e.message));
      if ( e.stack ) // Firefox when throwing 'new Error(msg)':
        test_div.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));
      tests_div.appendChild(test_div);
    }

    me.printStats = function(stats) {
      var holder_div = document.createElement('DIV');
      var stats_div  = document.createElement('DIV');

      holder_div.className = 'stats-holder';
      stats_div.style.display='';  // Show global stats by default.
      stats_div.className = 'stats';
      stats_div.innerHTML = 
        '<h2>Summary</h2>'+
        'Tests: '+stats.tests+'<br/>'+
        'Tests - Failed: '+stats.failed_tests+'<br/>'+
        'Tests - Errors: '+stats.errored_tests+'<br/>'+
        'Assertions: '+stats.assertions+'<br/>';
      holder_div.appendChild(stats_div);
      stats_container_div.appendChild(holder_div);
    }

    // Helper functions to create tags:

    function clearing_div() {
      var d = document.createElement('DIV');
      d.className="clear";
      return d;
    }

    function tag(tagType,text) {
      var p=document.createElement(tagType);
      var ptext=document.createTextNode(text);
      p.appendChild(ptext);
      return p;
    }

    function passed() {
      var span=tag('SPAN',"PASSED");
      span.className="pass";
      return span;
    }

    function failed() {
      var span=tag('SPAN',"FAILED");
      span.className="fail";
      return span;
    }

    function errored() {
      var span=tag('SPAN',"ERROR!");
      span.className="error";
      return span;
    }

  }

  return module;

}();
