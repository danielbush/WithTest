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

// Utility functions used by various parts of unitjs.

$dlb_id_au$.unitJS.utils = function() {

  var module = {};

  module.each = function(thing,fn) {
    // thing.length handles 'arguments' object.
    if(thing.length) {
      for(var i=0;i<thing.length;i++) {
        fn(thing[i],i);
      }
    }
    else if(typeof(thing) == 'object') {
      for(var n in thing) {
        if(thing.hasOwnProperty(n)) {
          fn(thing[n],n);
        }
      }
    }
  };

  // Depth-first recursive walk of 'tests'.
  //
  // We iterate items.
  // If test, run 'visit'.
  // If tests, recurse.
  // For each invocation (ie each 'tests' instance), if 'sweep' is
  // given, iterate this over tests.items.  Note that this happens
  // after recursing on tests' nested tests.
  //
  // visit: this function will visit all 'test' and 'tests'
  // sweep:
  //   This function will iterate on items in a given 'tests' object.
  //   It can receive both 'test' and 'tests' objects (whatever is in
  //   'items').

  module.treewalk = function(tests,visit,sweep) {
    module.each(tests.items,function(item){
      visit(item);
      if(item.type=='tests') {
        module.treewalk(item,visit,sweep);
      }
    });
    if(sweep) {
      module.each(tests.items,function(item){
        sweep(tests,item);
      });
    }
  };

  return module;

}();
