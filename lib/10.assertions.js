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
// your tests.
//
// This is being replaced by the 'shoulds' module.

$dlb_id_au$.unitJS.assertions = function() {

  var module    = {};
  var utils     = $dlb_id_au$.unitJS.assert_utils;
  var STATE     = $dlb_id_au$.unitJS.data.testStates;
  var testLifetime = $dlb_id_au$.unitJS.testLifetime;

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
    module._validateArguments(1, arguments);
    var booleanValue = module.nonCommentArg(1, 1, arguments);

    if (typeof(booleanValue) != 'boolean')
      utils.error('Bad argument to assert(boolean)');

    _assert( module.commentArg(1, arguments), 
             booleanValue === true, 
             'Call to assert(boolean) with false');
  };

  module.assertTrue = function() {
    module._validateArguments(1, arguments);
    var booleanValue = module.nonCommentArg(1, 1, arguments);

    if (typeof(booleanValue) != 'boolean')
      utils.error('Bad argument to assertTrue(boolean)');

    _assert( module.commentArg(1, arguments), 
             booleanValue === true, 
             'Call to assertTrue(boolean) with false');
  };

  module.assertFalse = function() {
    module._validateArguments(1, arguments);
    var booleanValue = module.nonCommentArg(1, 1, arguments);

    if (typeof(booleanValue) != 'boolean')
      utils.error('Bad argument to assertFalse(boolean)');

    _assert( module.commentArg(1, arguments), 
             booleanValue === false, 
             'Call to assertFalse(boolean) with true');
  };

  module.assertEquals = function() {
    module._validateArguments(2, arguments);
    var var1 = module.nonCommentArg(1, 2, arguments);
    var var2 = module.nonCommentArg(2, 2, arguments);
    _assert( module.commentArg(2, arguments), 
             var1 === var2, 
             'Expected ' + 
             utils.displayStringForValue(var1) + 
             ' but was ' + 
             utils.displayStringForValue(var2));
  };

  module.assertNotEquals = function() {
    module._validateArguments(2, arguments);
    var var1 = module.nonCommentArg(1, 2, arguments);
    var var2 = module.nonCommentArg(2, 2, arguments);
    _assert( module.commentArg(2, arguments), 
             var1 !== var2, 
             'Expected not to be ' + 
             utils.displayStringForValue(var2));
  };

  module.assertNull = function() {
    module._validateArguments(1, arguments);
    var aVar = module.nonCommentArg(1, 1, arguments);
    _assert( module.commentArg(1, arguments), 
             aVar === null, 
             'Expected ' + 
             utils.displayStringForValue(null) + 
             ' but was ' + 
             utils.displayStringForValue(aVar));
  };

  module.assertNotNull = function() {
    module._validateArguments(1, arguments);
    var aVar = module.nonCommentArg(1, 1, arguments);
    _assert( module.commentArg(1, arguments), 
             aVar !== null, 
             'Expected not to be ' + 
             utils.displayStringForValue(null));
  };

  module.assertUndefined = function() {
    module._validateArguments(1, arguments);
    var aVar = module.nonCommentArg(1, 1, arguments);
    _assert( module.commentArg(1, arguments), 
             aVar === _UNDEFINED_VALUE, 
             'Expected ' + 
             utils.displayStringForValue(_UNDEFINED_VALUE) + 
             ' but was ' + 
             utils.displayStringForValue(aVar));
  };

  module.assertNotUndefined = function() {
    module._validateArguments(1, arguments);
    var aVar = module.nonCommentArg(1, 1, arguments);
    _assert( module.commentArg(1, arguments), 
             aVar !== _UNDEFINED_VALUE, 
             'Expected not to be ' + 
             utils.displayStringForValue(_UNDEFINED_VALUE));
  };

  module.assertNaN = function() {
    module._validateArguments(1, arguments);
    var aVar = module.nonCommentArg(1, 1, arguments);
    _assert(module.commentArg(1, arguments), isNaN(aVar),
            'Expected NaN');
  };

  module.assertNotNaN = function() {
    module._validateArguments(1, arguments);
    var aVar = module.nonCommentArg(1, 1, arguments);
    _assert(module.commentArg(1, arguments), !isNaN(aVar),
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
    module._validateArguments(2, arguments);
    var var1 = module.nonCommentArg(1, 2, arguments);
    var var2 = module.nonCommentArg(2, 2, arguments);
    var type1 = utils.trueTypeOf(var1);
    var type2 = utils.trueTypeOf(var2);
    var msg = module.commentArg(2, arguments) ? 
      module.commentArg(2, arguments):'';
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
              'Expected ' + utils.displayStringForValue(var1) + 
              ' but was ' + utils.displayStringForValue(var2));
    }
  };

  module.assertArrayEquals = module.assertObjectEquals;

  module.assertEvaluatesToTrue = function() {
    module._validateArguments(1, arguments);
    var value = module.nonCommentArg(1, 1, arguments);
    if (!value)
      utils.fail('',module.commentArg(1, arguments));
  };

  module.assertEvaluatesToFalse = function() {
    module._validateArguments(1, arguments);
    var value = module.nonCommentArg(1, 1, arguments);
    if (value)
      utils.fail('',module.commentArg(1, arguments));
  };

  module.assertHTMLEquals = function() {
    module._validateArguments(2, arguments);
    var var1 = module.nonCommentArg(1, 2, arguments);
    var var2 = module.nonCommentArg(2, 2, arguments);
    var var1Standardized = module.standardizeHTML(var1);
    var var2Standardized = module.standardizeHTML(var2);

    _assert( module.commentArg(2, arguments), 
             var1Standardized === var2Standardized, 
             'Expected ' + 
             utils.displayStringForValue(var1Standardized) + 
             ' but was ' + 
             utils.displayStringForValue(var2Standardized));
  };

  module.assertHashEquals = function() {
    module._validateArguments(2, arguments);
    var var1 = module.nonCommentArg(1, 2, arguments);
    var var2 = module.nonCommentArg(2, 2, arguments);
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
    module._validateArguments(3, arguments);
    var expected = module.nonCommentArg(1, 3, arguments);
    var actual = module.nonCommentArg(2, 3, arguments);
    var tolerance = module.nonCommentArg(3, 3, arguments);
    module.assertTrue(
      "Expected " + expected + 
        ", but got " + actual + 
        " which was more than " + tolerance + 
        " away", Math.abs(expected - actual) < tolerance);
  };

  module.assertContains = function() {
    module._validateArguments(2, arguments);
    var contained = module.nonCommentArg(1, 2, arguments);
    var container = module.nonCommentArg(2, 2, arguments);
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

  module.standardizeHTML = function(html) {
    var translator = document.createElement("DIV");
    translator.innerHTML = html;
    return translator.innerHTML;
  };

  module.argumentsIncludeComments = function(expectedNumberOfNonCommentArgs,args) {
    return args.length == expectedNumberOfNonCommentArgs + 1;
  };

  module.commentArg = function(expectedNumberOfNonCommentArgs,
                       args) {
    if (module.argumentsIncludeComments(
      expectedNumberOfNonCommentArgs,args))
      return args[0];

    return null;
  };

  module.nonCommentArg = function(desiredNonCommentArgIndex, 
                          expectedNumberOfNonCommentArgs, 
                          args) {
    return module.argumentsIncludeComments(
      expectedNumberOfNonCommentArgs, args) ?
      args[desiredNonCommentArgIndex] :
      args[desiredNonCommentArgIndex - 1];
  };
  
  module._validateArguments = function(expectedNumberOfNonCommentArgs,
                               args) {
    if (!( args.length == expectedNumberOfNonCommentArgs ||
           (args.length == expectedNumberOfNonCommentArgs + 1 && 
            typeof(args[0]) == 'string') ))
      module.error('Incorrect arguments passed to assert function');
  };


  wrapAssertions();
  return module;

}();
