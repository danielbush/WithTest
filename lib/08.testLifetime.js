/*
   This is a source file for UnitJS a unit testing framework
   for javascript.
   Copyright (C) 2014 Daniel Bush
   This program is distributed under the terms of the GNU
   General Public License.  A copy of the license should be
   enclosed with this project in the file LICENSE.  If not
   see <http://www.gnu.org/licenses/>.
  
*/

// A singleton object that tracks things like assertion count during
// the running of a single test.
//
// Use 'reset' before running each test.
//
// It should be very easy to turn this into an instantiable object
// should we need to go down this path at some point.

$dlb_id_au$.unitJS.testLifetime = function() {

  var module = {};

  module.assertions = 0;  // must be reset on each run
  module.assertion_level = 0;

  // To be called before every assertion or it() within a test.
  module.before_assert = function(){
    module.assertion_level++;
    if(module.assertion_level==1) {
      module.assertions++;
    }
  };

  // To be called after every assertion or it() within a test.
  module.after_assert = function(){
    module.assertion_level--;
  };

  // To be called before running a test.
  module.reset = function() {
    module.assertions = 0;
    module.assertion_level = 0;
  };

  console.log("loaded testLifetime");
  return module;

}();
