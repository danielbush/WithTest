/* 
 * This is a source file for UnitJS a unit testing framework
 * for javascript.
 * Copyright (C) 2009 Daniel Bush
 * This program is distributed under the terms of the GNU
 * General Public License.  A copy of the license should be
 * enclosed with this project in the file LICENSE.  If not
 * see <http://www.gnu.org/licenses/>.
 *
 * Substantial parts of this code were taken from the JSUnit
 * project.  The Initial Developer of the Original Code is
 * Edward Hieatt, edward@jsunit.net.  Portions created by
 * the Initial Developer are Copyright (C) 2003 the Initial
 * Developer.  All Rights Reserved.
 *
 */

var $web17_com_au$ = $web17_com_au$ || {};

/*
 * unitJS Module
 * Contains:
 * - Runner submodule
 * - Assertions submodule
 * - Utils submodule
 *
 */

$web17_com_au$.unitJS = function() {

  var module={};

  var _UNDEFINED_VALUE;

  /*
   * Runner submodule
   * ---------------------------------------------------
   */

  module.runner = function() {
    var runner={};

    /*
     * Run a set of unit tests.
     *   tests: a hash of test_names and their functions.
     *   testOrder: an array of test_names which should be
     *     in 'tests'.
     */

    runner.run = function(testOrder,tests) {
      // Initalize test_div.
      var body=document.getElementsByTagName('BODY')[0];
      var test_div=document.getElementById("tests");
      if ( test_div ) {
        body.removeChild(test_div);
      }
      var test_div=document.createElement('DIV');
      test_div.id = "tests";
      body.appendChild( test_div );

      // Helper functions to create tags:
      function tag(tagType,text) {
        var p=document.createElement(tagType);
        var ptext=document.createTextNode(text);
        p.appendChild(ptext);
        return p;
      }
      function passed() {
        var span=tag('SPAN',"PASSED");
        span.style.color="green";
        span.style.fontWeight="bold";
        return span;
      }
      function failed() {
        var span=tag('SPAN',"FAILED");
        span.style.color="red";
        span.style.fontWeight="bold";
        return span;
      }

      for ( var i=0; i<testOrder.length; i++ ) {
        var test_name=testOrder[i];
        var test_div2=document.createElement('DIV');
        test_div.appendChild(test_div2);
        t=tag('P',(i+1)+': '+test_name+'... ');
        test_div2.appendChild(t);
        try {
          tests[test_name]();
          t.appendChild(passed());
        }
        catch(e) {
          t.appendChild(failed());
          if ( e.comment )
            test_div2.appendChild(tag('P',"Comment: "+e.comment));
          test_div2.appendChild(tag('P',"Error message: "+e.jsUnitMessage));
          test_div2.appendChild(tag('PRE',"Stack trace: "+e.stackTrace));
          // e.stack (firefox) when throwing 'new Error(msg)':
          if ( e.stack )
            test_div2.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));
        }
      }
    }
    return runner;
  }();

  /*
   * Assertions submodule
   * ---------------------------------------------------
   * - contains all assertion code
   *
   */

  module.assertions = function() {

    var assertions={};


    function _assert(comment, booleanValue, failureMessage) {
      if (!booleanValue) {

        // Use own error with custom-built stacktrace:

        throw new module.utils.JsUnitException(comment, failureMessage);

        // TODO (29-Aug-08):
        // For firefox, we can get a good stack trace using
        // the Error object and its in-built 'stack' method:
        //
        //throw new Error(failureMessage);
        //
        // This will cause problems when we test directly for
        // an exception eg
        // try {
        //   something that should fail
        //   otherwise fail in a different way
        // }
        // catch(e) {
        //   check how we failed
        // }

      }
    }

    assertions.assert = function() {
      module.utils._validateArguments(1, arguments);
      var booleanValue = module.utils.nonCommentArg(1, 1, arguments);

      if (typeof(booleanValue) != 'boolean')
        module.utils.error('Bad argument to assert(boolean)');

      _assert( module.utils.commentArg(1, arguments), 
               booleanValue === true, 
               'Call to assert(boolean) with false');
    }

    assertions.assertTrue = function() {
      module.utils._validateArguments(1, arguments);
      var booleanValue = module.utils.nonCommentArg(1, 1, arguments);

      if (typeof(booleanValue) != 'boolean')
        module.utils.error('Bad argument to assertTrue(boolean)');

      _assert( module.utils.commentArg(1, arguments), 
               booleanValue === true, 
               'Call to assertTrue(boolean) with false');
    }

    assertions.assertFalse = function() {
      module.utils._validateArguments(1, arguments);
      var booleanValue = module.utils.nonCommentArg(1, 1, arguments);

      if (typeof(booleanValue) != 'boolean')
        module.utils.error('Bad argument to assertFalse(boolean)');

      _assert( module.utils.commentArg(1, arguments), 
               booleanValue === false, 
               'Call to assertFalse(boolean) with true');
    }

    assertions.assertEquals = function() {
      module.utils._validateArguments(2, arguments);
      var var1 = module.utils.nonCommentArg(1, 2, arguments);
      var var2 = module.utils.nonCommentArg(2, 2, arguments);
      _assert( module.utils.commentArg(2, arguments), 
               var1 === var2, 
               'Expected ' + 
                 module.utils._displayStringForValue(var1) + 
                 ' but was ' + 
                 module.utils._displayStringForValue(var2));
    }

    assertions.assertNotEquals = function() {
      module.utils._validateArguments(2, arguments);
      var var1 = module.utils.nonCommentArg(1, 2, arguments);
      var var2 = module.utils.nonCommentArg(2, 2, arguments);
      _assert( module.utils.commentArg(2, arguments), 
               var1 !== var2, 
               'Expected not to be ' + 
               module.utils._displayStringForValue(var2));
    }

    assertions.assertNull = function() {
      module.utils._validateArguments(1, arguments);
      var aVar = module.utils.nonCommentArg(1, 1, arguments);
      _assert( module.utils.commentArg(1, arguments), 
               aVar === null, 
               'Expected ' + 
                 module.utils._displayStringForValue(null) + 
                 ' but was ' + 
                 module.utils._displayStringForValue(aVar));
    }

    assertions.assertNotNull = function() {
      module.utils._validateArguments(1, arguments);
      var aVar = module.utils.nonCommentArg(1, 1, arguments);
      _assert( module.utils.commentArg(1, arguments), 
               aVar !== null, 
               'Expected not to be ' + 
               module.utils._displayStringForValue(null));
    }

    assertions.assertUndefined = function() {
      module.utils._validateArguments(1, arguments);
      var aVar = module.utils.nonCommentArg(1, 1, arguments);
      _assert( module.utils.commentArg(1, arguments), 
               aVar === _UNDEFINED_VALUE, 
               'Expected ' + 
                 module.utils._displayStringForValue(_UNDEFINED_VALUE) + 
                 ' but was ' + 
                 module.utils._displayStringForValue(aVar));
    }

    assertions.assertNotUndefined = function() {
      module.utils._validateArguments(1, arguments);
      var aVar = module.utils.nonCommentArg(1, 1, arguments);
      _assert( module.utils.commentArg(1, arguments), 
               aVar !== _UNDEFINED_VALUE, 
               'Expected not to be ' + 
                 module.utils._displayStringForValue(_UNDEFINED_VALUE));
    }

    assertions.assertNaN = function() {
      module.utils._validateArguments(1, arguments);
      var aVar = module.utils.nonCommentArg(1, 1, arguments);
      _assert(module.utils.commentArg(1, arguments), isNaN(aVar),
              'Expected NaN');
    }

    assertions.assertNotNaN = function() {
      module.utils._validateArguments(1, arguments);
      var aVar = module.utils.nonCommentArg(1, 1, arguments);
      _assert(module.utils.commentArg(1, arguments), !isNaN(aVar),
              'Expected not NaN');
    }

    assertions.assertObjectEquals = function() {
      module.utils._validateArguments(2, arguments);
      var var1 = module.utils.nonCommentArg(1, 2, arguments);
      var var2 = module.utils.nonCommentArg(2, 2, arguments);
      var type;
      var msg = module.utils.commentArg(2, arguments) ? 
                module.utils.commentArg(2, arguments):'';
      var isSame = (var1 === var2);
      //shortpath for references to same object
      var isEqual = ( 
        (type = module.utils._trueTypeOf(var1)) == 
        module.utils._trueTypeOf(var2) );
      if (isEqual && !isSame) {
        switch (type) {
          case 'String':
          case 'Number':
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
                    assertions.assertObjectEquals(
                      msg + ' found nested ' + 
                      type + '@' + i + '\n', 
                      var1[i], var2[i]);
          }
          _assert(msg, isEqual, 
                  'Expected ' + module.utils._displayStringForValue(var1) + 
                  ' but was ' + module.utils._displayStringForValue(var2));
      }
    }

    assertions.assertArrayEquals = assertions.assertObjectEquals;

    assertions.assertEvaluatesToTrue = function() {
      module.utils._validateArguments(1, arguments);
      var value = module.utils.nonCommentArg(1, 1, arguments);
      if (!value)
        module.utils.fail(module.utils.commentArg(1, arguments));
    }

    assertions.assertEvaluatesToFalse = function() {
      module.utils._validateArguments(1, arguments);
      var value = module.utils.nonCommentArg(1, 1, arguments);
      if (value)
        module.utils.fail(module.utils.commentArg(1, arguments));
    }

    assertions.assertHTMLEquals = function() {
      module.utils._validateArguments(2, arguments);
      var var1 = module.utils.nonCommentArg(1, 2, arguments);
      var var2 = module.utils.nonCommentArg(2, 2, arguments);
      var var1Standardized = module.utils.standardizeHTML(var1);
      var var2Standardized = module.utils.standardizeHTML(var2);

      _assert( module.utils.commentArg(2, arguments), 
               var1Standardized === var2Standardized, 
               'Expected ' + 
               module.utils._displayStringForValue(var1Standardized) + 
               ' but was ' + 
               module.utils._displayStringForValue(var2Standardized));
    }

    assertions.assertHashEquals = function() {
      module.utils._validateArguments(2, arguments);
      var var1 = module.utils.nonCommentArg(1, 2, arguments);
      var var2 = module.utils.nonCommentArg(2, 2, arguments);
      for (var key in var1) {
        assertions.assertNotUndefined(
          "Expected hash had key " + key + 
          " that was not found", var2[key]);
        assertions.assertEquals(
          "Value for key " + key + 
          " mismatch - expected = " + var1[key] + 
          ", actual = " + var2[key], var1[key], var2[key]);
      }
      for (var key in var2) {
        assertions.assertNotUndefined(
          "Actual hash had key " + key + 
          " that was not expected", var1[key]);
      }
    }

    assertions.assertRoughlyEquals = function() {
      module.utils._validateArguments(3, arguments);
      var expected = module.utils.nonCommentArg(1, 3, arguments);
      var actual = module.utils.nonCommentArg(2, 3, arguments);
      var tolerance = module.utils.nonCommentArg(3, 3, arguments);
      assertions.assertTrue(
        "Expected " + expected + 
        ", but got " + actual + 
        " which was more than " + tolerance + 
        " away", Math.abs(expected - actual) < tolerance);
    }

    assertions.assertContains = function() {
      module.utils._validateArguments(2, arguments);
      var contained = module.utils.nonCommentArg(1, 2, arguments);
      var container = module.utils.nonCommentArg(2, 2, arguments);
      assertions.assertTrue(
        "Expected '" + container + 
        "' to contain '" + contained + "'",
        container.indexOf(contained) != -1);
    }

    assertions.assertJsUnitException = function(comment, allegedJsUnitException) {
      assertions.assertNotNull(comment, allegedJsUnitException);
      assertions.assert(comment, allegedJsUnitException.isJsUnitException);
      assertions.assertNotUndefined(comment, allegedJsUnitException.comment);
    }

    assertions.assertNonJsUnitException = function(comment, allegedNonJsUnitException) {
      assertions.assertNotNull(comment, allegedNonJsUnitException);
      assertions.assertUndefined(comment, allegedNonJsUnitException.isJsUnitException);
      assertions.assertNotUndefined(comment, allegedNonJsUnitException.description);
    }

    assertions.setUp = function() {
    }

    assertions.tearDown = function() {
    }

    return assertions;

  }();

  /*
   * Utils submodule
   * ---------------------------------------------------
   *
   */
  module.utils = function() {

    var utils = {};

    // The functions push(anArray, anObject) and pop(anArray)
    // exist because the JavaScript Array.push(anObject) and Array.pop()
    // functions are not available in IE 5.0

    utils.push = function(anArray, anObject) {
      anArray[anArray.length] = anObject;
    }

    utils.pop = function(anArray) {
      if (anArray.length >= 1) {
        delete anArray[anArray.length - 1];
        anArray.length--;
      }
    }

    utils.isBlank = function(str) {
      return utils.trim(str) == '';
    }

    utils.trim = function(str) {
      if (str == null) return null;

      var startingIndex = 0;
      var endingIndex = str.length - 1;

      while (str.substring(startingIndex, startingIndex + 1) == ' ')
        startingIndex++;

      while (str.substring(endingIndex, endingIndex + 1) == ' ')
        endingIndex--;

      if (endingIndex < startingIndex) return '';
      return str.substring(startingIndex, endingIndex + 1);
    }

    utils.getFunctionName = function(aFunction) {
      var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
      if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
        return regexpResult[2];
      }
      return 'anonymous';
    }

    utils.getStackTrace = function() {
      var result = '';

      if (typeof(arguments.caller) != 'undefined') { // IE, not ECMA
        for (var a = arguments.caller; a != null; a = a.caller) {
          result += '> ' + utils.getFunctionName(a.callee) + '\n';
          if (a.caller == a) {
            result += '*';
            break;
          }
        }
      }
      else { 

        // Mozilla, not ECMA
        // Fake an exception so we can get Mozilla's error stack.

        var testExcp;
        try { foo.bar; }
        catch(testExcp) {
          var stack = utils.parseErrorStack(testExcp);
          for (var i = 1; i < stack.length; i++) {
              result += '> ' + stack[i] + '\n';
          }
        }
      }
      return result;
    }

    utils.parseErrorStack = function(excp) {
      var stack = [];
      var name;

      if (!excp || !excp.stack) {
        return stack;
      }

      var stacklist = excp.stack.split('\n');

      for (var i = 0; i < stacklist.length - 1; i++) {
        var framedata = stacklist[i];
        name = framedata.match(/^(\w*)/)[1];
        if (!name) name = 'anonymous';
        stack[stack.length] = name;
      }

      // Remove top level anonymous functions to match IE

      while (stack.length && stack[stack.length - 1] == 'anonymous') {
        stack.length = stack.length - 1;
      }
      return stack;
    }

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
            switch (something.constructor)
                {
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
    }

    utils._displayStringForValue = function(aVar) {
      var result = '<' + aVar + '>';
      if (!(aVar === null || aVar === _UNDEFINED_VALUE)) {
        result += ' (' + utils._trueTypeOf(aVar) + ')';
      }
      return result;
    }

    utils.fail = function(failureMessage) {
      throw new utils.JsUnitException("Call to fail()", failureMessage);
    }

    utils.error = function(errorMessage) {
      var errorObject = new Object();
      errorObject.description = errorMessage;
      errorObject.stackTrace = utils.getStackTrace();
      throw errorObject;
    }

    utils.argumentsIncludeComments = function(expectedNumberOfNonCommentArgs, args) {
      return args.length == expectedNumberOfNonCommentArgs + 1;
    }

    utils.commentArg = function(expectedNumberOfNonCommentArgs, args) {
      if (utils.argumentsIncludeComments(expectedNumberOfNonCommentArgs, args))
        return args[0];

      return null;
    }

    utils.nonCommentArg = function( desiredNonCommentArgIndex, 
                                    expectedNumberOfNonCommentArgs, 
                                    args) {
      return utils.argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) ?
             args[desiredNonCommentArgIndex] :
             args[desiredNonCommentArgIndex - 1];
    }

    utils._validateArguments = function(expectedNumberOfNonCommentArgs, args) {
      if (!( args.length == expectedNumberOfNonCommentArgs ||
            (args.length == expectedNumberOfNonCommentArgs + 1 && 
             typeof(args[0]) == 'string') ))
        utils.error('Incorrect arguments passed to assert function');
    }

    utils.standardizeHTML = function(html) {
      var translator = document.createElement("DIV");
      translator.innerHTML = html;
      return translator.innerHTML;
    }

    utils.JsUnitException = function(comment, message) {
      this.isJsUnitException = true;
      this.comment = comment;
      this.jsUnitMessage = message;
      this.stackTrace = module.utils.getStackTrace();
    }

    return utils;
  }();


  return module;

}();
