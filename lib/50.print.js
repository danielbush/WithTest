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

  (function(){

    // Convert 'tests' to div.-unitjs-tests.
    // Convert 'test' to div.-unitjs-test and append in order to the
    // 'tests' div.

    module.print = function(tests) {
      var n,d;

      n = tests.node = module.createTests(tests);
      utils.treewalk(tests,createNode,append);
      delete tests.node;

      d = node('div',['-unitjs']);
      d.appendChild(n);
      return d;
    };


    var createNode = function(item) {
      if(item.type == 'tests') {
        item.node = module.createTests(item);
      } 
      else if(item.type == 'test') {
        item.node = module.createTest(item);
      } 
    };

    var append = function(tests,item) {
      tests.node.appendChild(item.node);
      delete item.node;
    };

  })();


  var node = function(tagname,classes) {
    var d;
    d = document.createElement(tagname);
    if(classes) {
      utils.each(classes,function(cl){
        d.className += cl + ' ';
      });
    }
    return d;
  };

  var munge = function(text) {
    return text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
  };

  module.createTests = function(tests) {
    var d = node('div',['tests']);
    var d2;

    d2 = node('div',['name']);
    d2.innerHTML = tests.name;
    d.appendChild(d2);
    
    return d;
  };

  module.createTest = function(test) {
    var d = node('div',['test',test.status]);
    var d2,d3;
    d2 = node('div',['name']);
    d2.innerHTML = test.test;
    d.appendChild(d2);

    d3 = node('div',['status',test.status]);
    d3.innerHTML = test.status;
    d2.appendChild(d3);

    d2 = node('div',['details']);
    d.appendChild(d2);

    if(test.comment) {
      d3 = node('div',['comment']);
      d3.innerHTML = test.comment;
      d2.appendChild(d3);
    }
    if(test.message) {
      d3 = node('div',['message']);
      d3.innerHTML = test.message;
      d2.appendChild(d3);
    }
    if(test.stack) {
      d3 = node('pre',['message']);
      d3.innerHTML = munge(test.stack);
      d2.appendChild(d3);
    }

    return d;

  };

  return module;

}();
