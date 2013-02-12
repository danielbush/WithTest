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

// This module deals with iterating through a 'tests' structure and
// converting it into html (the DOM).
// You could of course take the same iterations here and generate
// completely different output eg for terminal.

$dlb_id_au$.unitJS.print = function() {

  var module = {};
  var utils     = $dlb_id_au$.unitJS.utils;
  var states    = $dlb_id_au$.unitJS.data.testStates;

  (function(){

    // Generate a bunch of html nodes representing the output from
    // 'tests'.

    module.print = function(tests) {
      var d,o;

      o = createTests(tests);
      tests.node = o.node;
      tests.groupNode = o.groupNode;
      utils.treewalk(tests,createNode,append);

      d = node('div',['-unitjs']);
      d.appendChild(o.node);
      return {
        node:d,
        collapseAll:function(reverse){
          utils.treewalk(tests,function(item){
            if(item.type == 'tests') {
              if(reverse) {
                item.groupNode.style.display = '';
              } else {
                item.groupNode.style.display = 'none';
              }
            }
            if(item.type == 'test') {
              if(reverse) {
                item.node.style.display = '';
              } else {
                item.node.style.display = 'none';
              }
            }
          });
        },
        hideTests:function(reverse){
          utils.treewalk(tests,function(item){
            if(item.type == 'test') {
              if(reverse) {
                item.node.style.display = '';
              } else {
                item.node.style.display = 'none';
              }
            }
          });
        },
        hideDetails:function(reverse){
          utils.treewalk(tests,function(item){
            if(item.type == 'test') {
              if(reverse) {
                item.detailsNode.style.display = '';
              } else {
                item.detailsNode.style.display = 'none';
              }
            }
          });
        },
        showOnlyFailed:function(){
          utils.treewalk(tests,function(item){
            if(item.type == 'test') {
              var failed = (item.status == states.FAIL ||
                            item.status == states.ERROR);
              if(failed) {
                item.node.style.display = '';
                item.detailsNode.style.display = '';
              } else {
                item.node.style.display = 'none';
              }
            }
          });
        }
      };
    };


    var createNode = function(item) {
      var o;
      if(item.type == 'tests') {
        o = createTests(item);
        item.node = o.node;
        item.groupNode = o.groupNode;
      } 
      else if(item.type == 'test') {
        o = createTest(item);
        item.node = o.node;
        item.detailsNode = o.details;
        item.nameNode = o.name;
      } 
    };

    var append = function(tests,item) {
      tests.groupNode.appendChild(item.node);
    };

  })();

  // Create a DOM node with attribute class set to array of class
  // names in 'classes'.

  var node = function(tagname,classes,inner) {
    var d;
    d = document.createElement(tagname);
    if(classes) {
      utils.each(classes,function(cl){
        d.className += cl + ' ';
      });
    }
    if(inner) {
      d.innerHTML = inner;
    }
    return d;
  };

  // Create an input type=button.

  module.printButton = function(txt,click) {
    var button = node('input',null);
    button.setAttribute('type','button');
    button.setAttribute('value',txt);
    button.onclick = function(){click();};
    return button;
  };

  // Create an input type=button which toggles a reverse flag.
  //
  // 'reverse' alternates between false and true with every call.
  // 'reverse' is passed to 'click'.
  // If 'alttxt' is given, it will be used when reverse=true.

  module.toggleButton = function(txt,click,alttxt) {
    var reverse = false;
    var button = node('input',null);
    button.setAttribute('type','button');
    button.setAttribute('value',txt);
    button.onclick = function(){
      click(reverse);
      reverse=!reverse;
      if(alttxt) {
        if(reverse) {
          button.setAttribute('value',alttxt);
        } else {
          button.setAttribute('value',txt);
        }
      }
    };
    return button;
  };

  // Create div representing a 'tests' data structure.

  var createTests = function(tests) {
    var d = node('div',['tests',tests.status]);
    var d2,d3;
    var name;

    name = d2 = node('div',['name']);
    d2.innerHTML = tests.name;
    d2.appendChild(printStats(tests.cumulative));
    d.appendChild(d2);

    d3 = node('div',['test-group']);
    d.appendChild(d3);

    name.onclick = function() {
      var disp = d3.style.display;
      if(disp=='none') {
        d3.style.display = '';
      } else {
        d3.style.display = 'none';
      }
    };
    d2.style.cursor = 'pointer';
    
    return {
      node:d,
      groupNode:d3
    };
  };

  // Create div representing a 'stats' data structure.

  var printStats = function(stats) {
    var d = node('div',['stats']);
    var f = function(key,val) {
      var tuple = node('span',['tuple']);
      tuple.appendChild(node('span',['key'],key));
      tuple.appendChild(node('span',['value'],String(val)));
      d.appendChild(tuple);
    };
    f('Pass:',stats.pass);
    f('fail:',stats.fail);
    f('error:',stats.error);
    f('not impl:',stats.not_implemented);
    f('tests:',stats.tests);
    f('assertions:',stats.assertions);
    return d;
  };

  // Create div representing a 'test' data structure.

  var createTest = function(test) {
    var d = node('div',['test',test.status]);
    var d2,d3;
    var name,details;
    name = d2 = node('div',['name']);
    d2.innerHTML = test.test;
    d.appendChild(d2);

    d3 = node('div',['status',test.status]);
    d3.innerHTML = test.status;
    d2.appendChild(d3);

    details = d2 = node('div',['details']);
    d.appendChild(d2);

    if(test.comment) {
      d3 = node('div',['comment']);
      d3.appendChild(document.createTextNode(test.comment));
      d2.appendChild(d3);
    }
    if(test.message) {
      d3 = node('div',['message']);
      d3.appendChild(document.createTextNode(test.message));
      d2.appendChild(d3);
    }
    if(test.stack) {
      d3 = node('pre',['message']);
      d3.appendChild(document.createTextNode(test.stack));
      d2.appendChild(d3);
    }

    name.onclick = function() {
      var disp = details.style.display;
      if(disp == 'none') {
        details.style.display = '';
      } else {
        details.style.display = 'none';
      }
    };
    name.style.cursor = 'pointer';

    return {
      node:d,
      name:name,
      details:details
    };

  };

  return module;

}();
