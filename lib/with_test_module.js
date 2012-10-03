/*
   This is a source file for UnitJS a unit testing framework
   for javascript.
   Copyright (C) 2009-2012 Daniel Bush
   This program is distributed under the terms of the GNU
   General Public License.  A copy of the license should be
   enclosed with this project in the file LICENSE.  If not
   see <http://www.gnu.org/licenses/>.

   Parts of this code relating to assertions were taken from the
   JSUnit project: Edward Hieatt, edward@jsunit.net Copyright (C) 2003
   All Rights Reserved.
*/ 

$dlb_id_au$.unitJS.with_test_module = function() {

  var module = {};

  var U     = $dlb_id_au$.unitJS;
  var A     = U.assertions;

  // Create a unitjs section.
  //
  // This can include subsections.

  var createSection = function(name,secfn) {
    var label = 0;
    var test_module = {
      section:name
    };
    secfn({
      test:function(name,testfn) {
        test_module[++label] = {
          test:name,
          fn:function(){testfn(U.assertions);}
        }
      },
      section:function() {
        test_module[++label] = createSection.apply(null,arguments);
      }
    });
    return test_module;
  };

  module.with_test_module = function(module_name,fn) {

    var LABEL = 0;
    var all = {
      statements:{
        section:module_name
      }
    };

    fn({
      section:function(){
        all.statements[++LABEL] = createSection.apply(null,arguments);
      }
    });

    return all;
  };

  return module;

}();

