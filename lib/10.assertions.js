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

// This module defines the available assertions that can be made in
// your tests. It also provides a function 'doTest' that runs a test
// data structure.

$dlb_id_au$.unitJS.assertions = function() {

  var module = {};
  var utils = {};  // Util functions defined at bottom of this module.
  var STATE     = $dlb_id_au$.unitJS.data.testStates;

  // A singleton object that tracks things like assertion count during
  // the running of a single test.
  //
  // Use 'reset' before running each test.

  var testLifetime = {
    assertions:0,  // must be reset on each run
    assertion_level:0,
    before_assert:function(){
      this.assertion_level++;
      if(this.assertion_level==1) {
        this.assertions++;
      }
    },
    after_assert:function(){
      this.assertion_level--;
    },
    reset:function() {
      this.assertions = 0;
      this.assertion_level = 0;
    }
  };

  // Wrap public assertions with a wrapper that calls
  // before/after_assert etc
  //
  // Called at end of this module.

  var wrapAssertions = function() {
    for(var i in module) {
      if(/^assert/.test(i)) {
        module[i] = function(assert_fn) {
          return function() {
            testLifetime.before_assert();
            assert_fn.apply(this,arguments);
            testLifetime.after_assert();
          };
        }(module[i]);
      }
    }
  };


  // Run a test 'test' and update it.

  module.doTest = function(test) {
    var caught = false;
    testLifetime.reset();
    if(!test.fn) {
      test.status = STATE.NOTEST;
      return;
    }
    try {
      test.fn.call(module);
    }
    catch(e) {
      caught = true;
      test.message = e.message;  // js error message
      test.comment = e.comment;  // assertion comment from author
      test.stack = e.stack;
      if(e.isFailure) {
        test.status = STATE.FAIL;
      }
      else {
        test.status = STATE.ERROR;
      }
    }
    test.assertions = testLifetime.assertions;
    if(!caught) {
      if(test.assertions === 0) {
        test.status = STATE.NOASSERTIONS;
      } else {
        test.status = STATE.PASS;
      }
    }
    else {
    }
  };


  // Public assertions start here...
  //
  // Most of this code including utils is taken directly
  // from the original jsunit project.

  var _UNDEFINED_VALUE;

  var _assert = function(comment, booleanValue, assertionTypeMessage) {
    if (!booleanValue) {
      utils.fail(comment, assertionTypeMessage);
    }
  };

  module.assert = function() {
    utils._validateArguments(1, arguments);
    var booleanValue = utils.nonCommentArg(1, 1, arguments);

    if (typeof(booleanValue) != 'boolean')
      utils.error('Bad argument to assert(boolean)');

    _assert( utils.commentArg(1, arguments), 
             booleanValue === true, 
             'Call to assert(boolean) with false');
  };

  module.assertTrue = function() {
    utils._validateArguments(1, arguments);
    var booleanValue = utils.nonCommentArg(1, 1, arguments);

    if (typeof(booleanValue) != 'boolean')
      utils.error('Bad argument to assertTrue(boolean)');

    _assert( utils.commentArg(1, arguments), 
             booleanValue === true, 
             'Call to assertTrue(boolean) with false');
  };

  module.assertFalse = function() {
    utils._validateArguments(1, arguments);
    var booleanValue = utils.nonCommentArg(1, 1, arguments);

    if (typeof(booleanValue) != 'boolean')
      utils.error('Bad argument to assertFalse(boolean)');

    _assert( utils.commentArg(1, arguments), 
             booleanValue === false, 
             'Call to assertFalse(boolean) with true');
  };

  module.assertEquals = function() {
    utils._validateArguments(2, arguments);
    var var1 = utils.nonCommentArg(1, 2, arguments);
    var var2 = utils.nonCommentArg(2, 2, arguments);
    _assert( utils.commentArg(2, arguments), 
             var1 === var2, 
             'Expected ' + 
             utils._displayStringForValue(var1) + 
             ' but was ' + 
             utils._displayStringForValue(var2));
  };

  module.assertNotEquals = function() {
    utils._validateArguments(2, arguments);
    var var1 = utils.nonCommentArg(1, 2, arguments);
    var var2 = utils.nonCommentArg(2, 2, arguments);
    _assert( utils.commentArg(2, arguments), 
             var1 !== var2, 
             'Expected not to be ' + 
             utils._displayStringForValue(var2));
  };

  module.assertNull = function() {
    utils._validateArguments(1, arguments);
    var aVar = utils.nonCommentArg(1, 1, arguments);
    _assert( utils.commentArg(1, arguments), 
             aVar === null, 
             'Expected ' + 
             utils._displayStringForValue(null) + 
             ' but was ' + 
             utils._displayStringForValue(aVar));
  };

  module.assertNotNull = function() {
    utils._validateArguments(1, arguments);
    var aVar = utils.nonCommentArg(1, 1, arguments);
    _assert( utils.commentArg(1, arguments), 
             aVar !== null, 
             'Expected not to be ' + 
             utils._displayStringForValue(null));
  };

  module.assertUndefined = function() {
    utils._validateArguments(1, arguments);
    var aVar = utils.nonCommentArg(1, 1, arguments);
    _assert( utils.commentArg(1, arguments), 
             aVar === _UNDEFINED_VALUE, 
             'Expected ' + 
             utils._displayStringForValue(_UNDEFINED_VALUE) + 
             ' but was ' + 
             utils._displayStringForValue(aVar));
  };

  module.assertNotUndefined = function() {
    utils._validateArguments(1, arguments);
    var aVar = utils.nonCommentArg(1, 1, arguments);
    _assert( utils.commentArg(1, arguments), 
             aVar !== _UNDEFINED_VALUE, 
             'Expected not to be ' + 
             utils._displayStringForValue(_UNDEFINED_VALUE));
  };

  module.assertNaN = function() {
    utils._validateArguments(1, arguments);
    var aVar = utils.nonCommentArg(1, 1, arguments);
    _assert(utils.commentArg(1, arguments), isNaN(aVar),
            'Expected NaN');
  };

  module.assertNotNaN = function() {
    utils._validateArguments(1, arguments);
    var aVar = utils.nonCommentArg(1, 1, arguments);
    _assert(utils.commentArg(1, arguments), !isNaN(aVar),
            'Expected not NaN');
  };

  // More general version of assertEquals
  // - assertEquals uses ===
  // - here we use == on strings and numbers
  //   so that object instances and literals are equal
  //   (see Notes below)
  // 
  // Notes
  // In javascript:
  //   - 1 == '1' => true
  //   - 'foo' == new String('foo')  => true
  //   - 'foo' === new String('foo') => false
  //

  module.assertObjectEquals = function() {
    utils._validateArguments(2, arguments);
    var var1 = utils.nonCommentArg(1, 2, arguments);
    var var2 = utils.nonCommentArg(2, 2, arguments);
    var type1 = utils._trueTypeOf(var1);
    var type2 = utils._trueTypeOf(var2);
    var msg = utils.commentArg(2, arguments) ? 
      utils.commentArg(2, arguments):'';
    var isSame = (var1 === var2);
    var sameType = (type1 == type2);
    var isEqual = isSame || sameType;
    if(!isSame) {
      switch (type1) {
      case 'String':
        if(type2!='String') {isEqual = false; break; }
        isEqual = (var1 == var2);
        break;
      case 'Number':
        if(type2!='Number') {isEqual = false; break; }
        isEqual = (var1 == var2);
        break;
      case 'Boolean':
      case 'Date':
        isEqual = (var1 === var2);
        break;
      case 'RegExp':
      case 'Function':
        isEqual = (var1.toString() === var2.toString());
        break;
      default: //Object | Array
        var i;
        if (isEqual = (var1.length === var2.length))
          for (i in var1)
            module.assertObjectEquals(
              msg + ' found nested ' + 
                type1 + '@' + i + '\n', 
              var1[i], var2[i]);
      }
      _assert(msg, isEqual, 
              'Expected ' + utils._displayStringForValue(var1) + 
              ' but was ' + utils._displayStringForValue(var2));
    }
  };

  module.assertArrayEquals = module.assertObjectEquals;

  module.assertEvaluatesToTrue = function() {
    utils._validateArguments(1, arguments);
    var value = utils.nonCommentArg(1, 1, arguments);
    if (!value)
      utils.fail('',utils.commentArg(1, arguments));
  };

  module.assertEvaluatesToFalse = function() {
    utils._validateArguments(1, arguments);
    var value = utils.nonCommentArg(1, 1, arguments);
    if (value)
      utils.fail('',utils.commentArg(1, arguments));
  };

  module.assertHTMLEquals = function() {
    utils._validateArguments(2, arguments);
    var var1 = utils.nonCommentArg(1, 2, arguments);
    var var2 = utils.nonCommentArg(2, 2, arguments);
    var var1Standardized = utils.standardizeHTML(var1);
    var var2Standardized = utils.standardizeHTML(var2);

    _assert( utils.commentArg(2, arguments), 
             var1Standardized === var2Standardized, 
             'Expected ' + 
             utils._displayStringForValue(var1Standardized) + 
             ' but was ' + 
             utils._displayStringForValue(var2Standardized));
  };

  module.assertHashEquals = function() {
    utils._validateArguments(2, arguments);
    var var1 = utils.nonCommentArg(1, 2, arguments);
    var var2 = utils.nonCommentArg(2, 2, arguments);
    for (var key in var1) {
      module.assertNotUndefined(
        "Expected hash had key " + key + 
          " that was not found", var2[key]);
      module.assertEquals(
        "Value for key " + key + 
          " mismatch - expected = " + var1[key] + 
          ", actual = " + var2[key], var1[key], var2[key]);
    }
    for (var key in var2) {
      module.assertNotUndefined(
        "Actual hash had key " + key + 
          " that was not expected", var1[key]);
    }
  };

  module.assertRoughlyEquals = function() {
    utils._validateArguments(3, arguments);
    var expected = utils.nonCommentArg(1, 3, arguments);
    var actual = utils.nonCommentArg(2, 3, arguments);
    var tolerance = utils.nonCommentArg(3, 3, arguments);
    module.assertTrue(
      "Expected " + expected + 
        ", but got " + actual + 
        " which was more than " + tolerance + 
        " away", Math.abs(expected - actual) < tolerance);
  };

  module.assertContains = function() {
    utils._validateArguments(2, arguments);
    var contained = utils.nonCommentArg(1, 2, arguments);
    var container = utils.nonCommentArg(2, 2, arguments);
    module.assertTrue(
      "Expected '" + container + 
        "' to contain '" + contained + "'",
      container.indexOf(contained) != -1);
  };

  // Test if error object is a failure raised by an assertion.

  module.assertFailure = function(comment, errorObject) {
    module.assertNotNull(comment, errorObject);
    module.assert(comment, errorObject.isFailure);
    module.assertNotUndefined(comment, errorObject.comment);
  };

  // Test if error object is an error other than a failure
  // (indicating an error has been thrown which is not related
  // to an assertion/test).

  module.assertError = function(comment, errorObject) {
    module.assertNotNull(comment, errorObject);
    module.assertUndefined(comment, errorObject.isFailure);
    module.assertNotUndefined(comment, errorObject.description);
  };


  //------------------------------------------------------------
  // Util functions for assertions
  //
  // Most of this code is carried over from the original
  // js unit code that unitjs was based on.


  /**
   * A more functional typeof
   * @param Object o
   * @return String
   */

  utils._trueTypeOf = function(something) {
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

  utils._displayStringForValue = function(aVar) {
    var result = '<' + aVar + '>';
    if (!(aVar === null || aVar === _UNDEFINED_VALUE)) {
      result += ' (' + utils._trueTypeOf(aVar) + ')';
    }
    return result;
  };

  /*
   * Raise a failure - this should only be used when
   * an assertion fails.  
   *
   * This involves raising an error and giving it a 
   * special flag and user comment field.
   *
   */

  utils.fail = function(comment,assertionTypeMessage) {
    var e = new Error(assertionTypeMessage);
    e.isFailure = true;
    e.comment = comment;
    throw e;
  };

  utils.error = function(errorMessage) {
    var e = new Error(errorMessage);
    e.description = errorMessage;  // FIXME: Do we need this???
    throw e;
  };

  utils.argumentsIncludeComments = function(expectedNumberOfNonCommentArgs,args) {
    return args.length == expectedNumberOfNonCommentArgs + 1;
  };

  utils.commentArg = function(expectedNumberOfNonCommentArgs,
                       args) {
    if (utils.argumentsIncludeComments(
      expectedNumberOfNonCommentArgs,args))
      return args[0];

    return null;
  };

  utils.nonCommentArg = function(desiredNonCommentArgIndex, 
                          expectedNumberOfNonCommentArgs, 
                          args) {
    return utils.argumentsIncludeComments(
      expectedNumberOfNonCommentArgs, args) ?
      args[desiredNonCommentArgIndex] :
      args[desiredNonCommentArgIndex - 1];
  };
  
  utils._validateArguments = function(expectedNumberOfNonCommentArgs,
                               args) {
    if (!( args.length == expectedNumberOfNonCommentArgs ||
           (args.length == expectedNumberOfNonCommentArgs + 1 && 
            typeof(args[0]) == 'string') ))
      utils.error('Incorrect arguments passed to assert function');
  };

  utils.standardizeHTML = function(html) {
    var translator = document.createElement("DIV");
    translator.innerHTML = html;
    return translator.innerHTML;
  };

  wrapAssertions();
  return module;

}();
