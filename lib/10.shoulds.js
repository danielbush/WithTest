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

    be:function(expected) {
      testLifetime.before_assert();
      if(utils.do_array_compare(this.thing,expected)) {
        if(!utils.array_compare(this.thing,expected)) {
          this._fail(expected,this.thing);
        }
      }
      else if(utils.compare(this.thing,expected)) {
      } else {
        this._fail(expected,this.thing);
      }
      testLifetime.after_assert();
    },

    not_be:function(expected) {
      testLifetime.before_assert();
      if(utils.do_array_compare(this.thing,expected)) {
        if(utils.array_compare(this.thing,expected)) {
          this._fail(expected,this.thing);
        }
      }
      else if(!utils.compare(this.thing,expected)) {
      } else {
        this._fail(expected,this.thing);
      }
      testLifetime.after_assert();
    },

    match:function(regex) {
      if(!regex.test(this.thing)) {
        this._fail(expected,this.thing);
      }
    },
    not_match:function(regex) {
    },

    // Test if something returns non-null or not-undefined.

    exist:function() {
      var expected = "*not null or undefined*";
      testLifetime.before_assert();
      switch(this.thing) {
      case null: 
      case undefined: 
        this._fail(null,this.thing,expected);
        break;
      default:
        break;
      }
      testLifetime.after_assert();
    },

    not_exist:function() {
      var expected = "*either null or undefined*";
      testLifetime.before_assert();
      switch(this.thing) {
      case null: 
      case undefined: 
        break;
      default:
        this._fail(null,this.thing,expected);
        break;
      }
      testLifetime.after_assert();
    },

    _fail:function(expected,actual,expectedmsg) {
      if(expectedmsg) {
        expected = expectedmsg
      } else {
        expected = utils.to_s(expected);
      }
      var errorMsg = 'Expected ' + expected + 
        ' but was ' + utils.to_s(actual);

      utils.fail(null,errorMsg);
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
