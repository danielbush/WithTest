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

  // Convert 'tests' to div.-unitjs-tests.
  // Convert 'test' to div.-unitjs-test and append in order to the
  // 'tests' div.

  module.print = function(tests) {
    var node;
    utils.treewalk(tests,createNode,append);
    node = tests.node;
    delete tests.node;
    return node;
  };

  var createNode = function(item) {
    item.node = document.createElement('DIV');
    if(item.type == 'tests') {
      item.node.setAttribute('class','-unitjs-tests');
    } else {
      item.node.setAttribute('class','-unitjs-test');
    }
  };

  var append = function(tests,item) {
    tests.node.appendChild(item.node);
    delete item.node;
  };

  return module;

}();
