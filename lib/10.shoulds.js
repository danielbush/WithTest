/*
   This is a source file for UnitJS a unit testing framework
   for javascript.
   Copyright (C) 2014 Daniel Bush
   This program is distributed under the terms of the GNU
   General Public License.  A copy of the license should be
   enclosed with this project in the file LICENSE.  If not
   see <http://www.gnu.org/licenses/>.
  
*/

// An rspec-inspired lib for doing assertions in your tests.
//
// Intended to replace assertions.js.
//
// Provides:
//   it(...) => wrapper around some value you want to test
//   error_for(...) => returns error
//
// Example:
//   it(a).should.be(1);
//   var e = error_for(fail())
//   e.should.exist();

$dlb_id_au$.unitJS.shoulds = function() {

  var module   = {};
  var utils    = $dlb_id_au$.unitJS.assert_utils;
  var testLifetime = $dlb_id_au$.unitJS.testLifetime;

  // ------------------------------------------------------------
  // Lower level stuff...

  module.Should = function(thing) {
    this.thing = thing;
  };

  module.Should.prototype = {

    be:function(thing) {
      testLifetime.before_assert();
      if(utils.do_array_compare(this.thing,thing)) {
        if(!utils.array_compare(this.thing,thing)) {
          this._fail(this.thing,thing);
        }
      }
      else if(utils.compare(this.thing,thing)) {
      } else {
        this._fail(this.thing,thing);
      }
      testLifetime.after_assert();
    },

    not_be:function(thing) {
      testLifetime.before_assert();
      if(utils.do_array_compare(this.thing,thing)) {
        if(utils.array_compare(this.thing,thing)) {
          this._fail(this.thing,thing);
        }
      }
      else if(!utils.compare(this.thing,thing)) {
      } else {
        this._fail(this.thing,thing);
      }
      testLifetime.after_assert();
    },

    // Test if something returns non-null or not-undefined.

    exist:function() {
      testLifetime.before_assert();
      switch(this.thing) {
      case null: 
      case undefined: 
        this._fail(null,this.thing,"*not null or undefined*");
        break;
      default:
        break;
      }
      testLifetime.after_assert();
    },

    not_exist:function() {
      testLifetime.before_assert();
      switch(this.thing) {
      case null: 
      case undefined: 
        break;
      default:
        this._fail(null,this.thing,"*either null or undefined*");
        break;
      }
      testLifetime.after_assert();
    },

    // TODO: 'comment': do we still need assertion comments?

    _fail:function(ours,theirs,expected,comment) {
      if(!expected) {
        expected = utils.displayStringForValue(ours);
      }
      var errorMsg = 'Expected ' + 
        expected + 
        ' but was ' + 
        utils.displayStringForValue(theirs);
      utils.fail(comment,errorMsg);
    }

  };

  // ------------------------------------------------------------
  // High level stuff

  // Create a should object that we can use over and over again.
  module.should = new module.Should(null);
  module.itretval = {should:module.should};

  module.it = function(thing) {
    //var should = new module.Should(thing):
    module.itretval.should.thing = thing;
    return module.itretval;
  };

  module.error_for = function(fn) {
    try {
      fn();
    } catch(e) {
      return e;
    }
    return null;
  };



  return module;

}();
