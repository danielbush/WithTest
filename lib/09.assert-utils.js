/*
   This is a source file for UnitJS a unit testing framework
   for javascript.
   Copyright (C) 2014 Daniel Bush
   This program is distributed under the terms of the GNU
   General Public License.  A copy of the license should be
   enclosed with this project in the file LICENSE.  If not
   see <http://www.gnu.org/licenses/>.
  
*/

// Utils for assisting with assertions and should.

$dlb_id_au$.unitJS.assert_utils = function() {

  var module = {};

  module.compare = function(a,b) {
    return (a===b);
  };

  // Check if both a,b are arrays.
  module.do_array_compare = function(a,b) {
    if(!a) return false;
    if(!b) return false;
    a = (a.constructor == Array);
    b = (b.constructor == Array);
    return (a && b);
  };

  // Recursively compare array of values.
  //
  // MOTIVATION
  // 
  // Two empty arrays are different (both != and !==).
  // When we're testing it's sometimes convenient
  // to be able to compare an array of values.

  module.array_compare = function(arr1,arr2) {
    var i,r;
    if(arr1.length!==arr2.length) {
      return false;
    }
    for(i=0;i<arr1.length;i++) {
      if(module.do_array_compare(arr1[i],arr2[i])) {
        r = module.array_compare(arr1[i],arr2[i]);
        if(r) {
          return true;
        } else {
          return false;
        }
      }
      else if(!module.compare(arr1[i],arr2[i])) {
        return false;
      }
    }
    return true;
  };

  /**
   * A more functional typeof
   * @param Object o
   * @return String
   */

  module.trueTypeOf = function(something) {
    var result = typeof something;
    try {
      switch (result) {
      case 'string':
      case 'boolean':
      case 'number':
        break;
      case 'object':
      case 'function':
        switch(something.constructor) {
        case String:
          result = 'String';
          break;
        case Boolean:
          result = 'Boolean';
          break;
        case Number:
          result = 'Number';
          break;
        case Array:
          result = 'Array';
          break;
        case RegExp:
          result = 'RegExp';
          break;
        case Function:
          result = 'Function';
          break;
        default:
          var m = something.constructor.toString().match(
              /function\s*([^( ]+)\(/
          );
          if (m)
            result = m[1];
          else
            break;
        }
        break;
      }
    }
    finally {
      result = result.substr(0, 1).toUpperCase() + result.substr(1);
      return result;
    }
  };

  module.to_s = function(aVar) {
    var result = '<' + aVar + '>';
    if (!(aVar === null || aVar === undefined)) {
      result += ' (' + module.trueTypeOf(aVar) + ')';
    }
    return result;
  };

  module.displayStringForValue = module.to_s;

  /*
   * Raise a failure - this should only be used when
   * an assertion fails.  
   *
   * This involves raising an error and giving it a 
   * special flag and user comment field.
   *
   * The comment field is optional and is not currently used by the
   * 'shoulds' module. 
   *
   */

  module.fail = function(comment,assertionTypeMessage) {
    var e = new Error(assertionTypeMessage);
    e.isFailure = true;
    e.comment = comment;
    throw e;
  };

  module.error = function(errorMessage) {
    var e = new Error(errorMessage);
    e.description = errorMessage;  // FIXME: Do we need this???
    throw e;
  };


  return module;

}();
