/* 
 * This is a source file for UnitJS a unit testing framework
 * for javascript.
 * Copyright (C) 2008 Daniel Bush
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

/* 
 * This is the UNITJS namespace which will
 * hold all our code.
 *
 */
var UNITJS={};

/*
 * Build UNITJS.assertions module.
 * This object is a bit like a module and is not 
 * intended to be instantiated.
 * Some of the functions and variables are private:
 *   function some_name(args...) { ... }
 * Others are public and are defined like:
 *   PUB.function_name = function(args...) { ... }
 *
 */
function build() {
  var PUB={};
  var _UNDEFINED_VALUE;
  
  /**
   + * A more functional typeof
   + * @param Object o
   + * @return String
   + */
  function _trueTypeOf(something) {
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
                          var m = something.constructor.toString().match(/function\s*([^( ]+)\(/);
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
  
  function _displayStringForValue(aVar) {
      var result = '<' + aVar + '>';
      if (!(aVar === null || aVar === _UNDEFINED_VALUE)) {
          result += ' (' + _trueTypeOf(aVar) + ')';
      }
      return result;
  }
  
  PUB.fail = function(failureMessage) {
      throw new JsUnitException("Call to fail()", failureMessage);
  }
  
  function error(errorMessage) {
      var errorObject = new Object();
      errorObject.description = errorMessage;
      errorObject.stackTrace = getStackTrace();
      throw errorObject;
  }
  
  function argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) {
      return args.length == expectedNumberOfNonCommentArgs + 1;
  }
  
  function commentArg(expectedNumberOfNonCommentArgs, args) {
      if (argumentsIncludeComments(expectedNumberOfNonCommentArgs, args))
          return args[0];
  
      return null;
  }
  
  function nonCommentArg(desiredNonCommentArgIndex, expectedNumberOfNonCommentArgs, args) {
      return argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) ?
             args[desiredNonCommentArgIndex] :
             args[desiredNonCommentArgIndex - 1];
  }
  
  function _validateArguments(expectedNumberOfNonCommentArgs, args) {
      if (!( args.length == expectedNumberOfNonCommentArgs ||
             (args.length == expectedNumberOfNonCommentArgs + 1 && typeof(args[0]) == 'string') ))
          error('Incorrect arguments passed to assert function');
  }
  
  function _assert(comment, booleanValue, failureMessage) {
      if (!booleanValue) {
          // Use own error with custom-built stacktrace:
          throw new JsUnitException(comment, failureMessage);

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
  
  PUB.assert=function() {
      _validateArguments(1, arguments);
      var booleanValue = nonCommentArg(1, 1, arguments);
  
      if (typeof(booleanValue) != 'boolean')
          error('Bad argument to assert(boolean)');
  
      _assert(commentArg(1, arguments), booleanValue === true, 'Call to assert(boolean) with false');
  }
  
  PUB.assertTrue = function() {
      _validateArguments(1, arguments);
      var booleanValue = nonCommentArg(1, 1, arguments);
  
      if (typeof(booleanValue) != 'boolean')
          error('Bad argument to assertTrue(boolean)');
  
      _assert(commentArg(1, arguments), booleanValue === true, 'Call to assertTrue(boolean) with false');
  }
  
  PUB.assertFalse = function() {
      _validateArguments(1, arguments);
      var booleanValue = nonCommentArg(1, 1, arguments);
  
      if (typeof(booleanValue) != 'boolean')
          error('Bad argument to assertFalse(boolean)');
  
      _assert(commentArg(1, arguments), booleanValue === false, 'Call to assertFalse(boolean) with true');
  }
  
  PUB.assertEquals = function() {
      _validateArguments(2, arguments);
      var var1 = nonCommentArg(1, 2, arguments);
      var var2 = nonCommentArg(2, 2, arguments);
      _assert(commentArg(2, arguments), var1 === var2, 'Expected ' + _displayStringForValue(var1) + ' but was ' + _displayStringForValue(var2));
  }
  
  PUB.assertNotEquals = function() {
      _validateArguments(2, arguments);
      var var1 = nonCommentArg(1, 2, arguments);
      var var2 = nonCommentArg(2, 2, arguments);
      _assert(commentArg(2, arguments), var1 !== var2, 'Expected not to be ' + _displayStringForValue(var2));
  }
  
  PUB.assertNull = function() {
      _validateArguments(1, arguments);
      var aVar = nonCommentArg(1, 1, arguments);
      _assert(commentArg(1, arguments), aVar === null, 'Expected ' + _displayStringForValue(null) + ' but was ' + _displayStringForValue(aVar));
  }
  
  PUB.assertNotNull = function() {
      _validateArguments(1, arguments);
      var aVar = nonCommentArg(1, 1, arguments);
      _assert(commentArg(1, arguments), aVar !== null, 'Expected not to be ' + _displayStringForValue(null));
  }
  
  PUB.assertUndefined = function() {
      _validateArguments(1, arguments);
      var aVar = nonCommentArg(1, 1, arguments);
      _assert(commentArg(1, arguments), aVar === _UNDEFINED_VALUE, 'Expected ' + _displayStringForValue(_UNDEFINED_VALUE) + ' but was ' + _displayStringForValue(aVar));
  }
  
  PUB.assertNotUndefined = function() {
      _validateArguments(1, arguments);
      var aVar = nonCommentArg(1, 1, arguments);
      _assert(commentArg(1, arguments), aVar !== _UNDEFINED_VALUE, 'Expected not to be ' + _displayStringForValue(_UNDEFINED_VALUE));
  }
  
  PUB.assertNaN = function() {
      _validateArguments(1, arguments);
      var aVar = nonCommentArg(1, 1, arguments);
      _assert(commentArg(1, arguments), isNaN(aVar), 'Expected NaN');
  }
  
  PUB.assertNotNaN = function() {
      _validateArguments(1, arguments);
      var aVar = nonCommentArg(1, 1, arguments);
      _assert(commentArg(1, arguments), !isNaN(aVar), 'Expected not NaN');
  }
  
  PUB.assertObjectEquals = function() {
      _validateArguments(2, arguments);
      var var1 = nonCommentArg(1, 2, arguments);
      var var2 = nonCommentArg(2, 2, arguments);
      var type;
      var msg = commentArg(2, arguments)?commentArg(2, arguments):'';
      var isSame = (var1 === var2);
      //shortpath for references to same object
      var isEqual = ( (type = _trueTypeOf(var1)) == _trueTypeOf(var2) );
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
                          PUB.assertObjectEquals(msg + ' found nested ' + type + '@' + i + '\n', var1[i], var2[i]);
          }
          _assert(msg, isEqual, 'Expected ' + _displayStringForValue(var1) + ' but was ' + _displayStringForValue(var2));
      }
  }
  
  PUB.assertArrayEquals = PUB.assertObjectEquals;
  
  PUB.assertEvaluatesToTrue = function() {
      _validateArguments(1, arguments);
      var value = nonCommentArg(1, 1, arguments);
      if (!value)
          PUB.fail(commentArg(1, arguments));
  }
  
  PUB.assertEvaluatesToFalse = function() {
      _validateArguments(1, arguments);
      var value = nonCommentArg(1, 1, arguments);
      if (value)
          PUB.fail(commentArg(1, arguments));
  }
  
  PUB.assertHTMLEquals = function() {
      _validateArguments(2, arguments);
      var var1 = nonCommentArg(1, 2, arguments);
      var var2 = nonCommentArg(2, 2, arguments);
      var var1Standardized = standardizeHTML(var1);
      var var2Standardized = standardizeHTML(var2);
  
      _assert(commentArg(2, arguments), var1Standardized === var2Standardized, 'Expected ' + _displayStringForValue(var1Standardized) + ' but was ' + _displayStringForValue(var2Standardized));
  }
  
  PUB.assertHashEquals = function() {
      _validateArguments(2, arguments);
      var var1 = nonCommentArg(1, 2, arguments);
      var var2 = nonCommentArg(2, 2, arguments);
      for (var key in var1) {
          PUB.assertNotUndefined("Expected hash had key " + key + " that was not found", var2[key]);
          PUB.assertEquals(
                  "Value for key " + key + " mismatch - expected = " + var1[key] + ", actual = " + var2[key],
                  var1[key], var2[key]
                  );
      }
      for (var key in var2) {
          PUB.assertNotUndefined("Actual hash had key " + key + " that was not expected", var1[key]);
      }
  }
  
  PUB.assertRoughlyEquals = function() {
      _validateArguments(3, arguments);
      var expected = nonCommentArg(1, 3, arguments);
      var actual = nonCommentArg(2, 3, arguments);
      var tolerance = nonCommentArg(3, 3, arguments);
      PUB.assertTrue(
              "Expected " + expected + ", but got " + actual + " which was more than " + tolerance + " away",
              Math.abs(expected - actual) < tolerance
              );
  }
  
  PUB.assertContains = function() {
      _validateArguments(2, arguments);
      var contained = nonCommentArg(1, 2, arguments);
      var container = nonCommentArg(2, 2, arguments);
      PUB.assertTrue(
              "Expected '" + container + "' to contain '" + contained + "'",
              container.indexOf(contained) != -1
              );
  }
  PUB.assertJsUnitException = function(comment, allegedJsUnitException) {
    PUB.assertNotNull(comment, allegedJsUnitException);
    PUB.assert(comment, allegedJsUnitException.isJsUnitException);
    PUB.assertNotUndefined(comment, allegedJsUnitException.comment);
  }

  PUB.assertNonJsUnitException = function(comment, allegedNonJsUnitException) {
    PUB.assertNotNull(comment, allegedNonJsUnitException);
    PUB.assertUndefined(comment, allegedNonJsUnitException.isJsUnitException);
    PUB.assertNotUndefined(comment, allegedNonJsUnitException.description);
  }
  
  function standardizeHTML(html) {
      var translator = document.createElement("DIV");
      translator.innerHTML = html;
      return translator.innerHTML;
  }
  
  
  function setUp() {
  }
  
  function tearDown() {
  }
  
  function getFunctionName(aFunction) {
      var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
      if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
          return regexpResult[2];
      }
      return 'anonymous';
  }
  
  function getStackTrace() {
      var result = '';
  
      if (typeof(arguments.caller) != 'undefined') { // IE, not ECMA
          for (var a = arguments.caller; a != null; a = a.caller) {
              result += '> ' + getFunctionName(a.callee) + '\n';
              if (a.caller == a) {
                  result += '*';
                  break;
              }
          }
      }
      else { // Mozilla, not ECMA
          // fake an exception so we can get Mozilla's error stack
          var testExcp;
          try
          {
              foo.bar;
          }
          catch(testExcp)
          {
              var stack = parseErrorStack(testExcp);
              for (var i = 1; i < stack.length; i++)
              {
                  result += '> ' + stack[i] + '\n';
              }
          }
      }
  
      return result;
  }
  
  function parseErrorStack(excp)
  {
      var stack = [];
      var name;
  
      if (!excp || !excp.stack)
      {
          return stack;
      }
  
      var stacklist = excp.stack.split('\n');
  
      for (var i = 0; i < stacklist.length - 1; i++)
      {
          var framedata = stacklist[i];
  
          name = framedata.match(/^(\w*)/)[1];
          if (!name) {
              name = 'anonymous';
          }
  
          stack[stack.length] = name;
      }
      // remove top level anonymous functions to match IE
  
      while (stack.length && stack[stack.length - 1] == 'anonymous')
      {
          stack.length = stack.length - 1;
      }
      return stack;
  }
  
  function JsUnitException(comment, message) {
      this.isJsUnitException = true;
      this.comment = comment;
      this.jsUnitMessage = message;
      this.stackTrace = getStackTrace();
  }
  
  
  
  function trim(str) {
      if (str == null)
          return null;
  
      var startingIndex = 0;
      var endingIndex = str.length - 1;
  
      while (str.substring(startingIndex, startingIndex + 1) == ' ')
          startingIndex++;
  
      while (str.substring(endingIndex, endingIndex + 1) == ' ')
          endingIndex--;
  
      if (endingIndex < startingIndex)
          return '';
  
      return str.substring(startingIndex, endingIndex + 1);
  }
  
  function isBlank(str) {
      return trim(str) == '';
  }
  
  // the functions push(anArray, anObject) and pop(anArray)
  // exist because the JavaScript Array.push(anObject) and Array.pop()
  // functions are not available in IE 5.0
  
  function push(anArray, anObject) {
      anArray[anArray.length] = anObject;
  }
  function pop(anArray) {
      if (anArray.length >= 1) {
          delete anArray[anArray.length - 1];
          anArray.length--;
      }
  }
  return PUB;
}
UNITJS.assertions=build();

/*
 * Build UNITJS.runner module.
 */
UNITJS.runner={};

/*
 * Run a set of unit tests.
 *   tests: a hash of test_names and their functions.
 *   testOrder: an array of test_names which should be
 *     in 'tests'.
 */
UNITJS.runner.run = function(testOrder,tests) {
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
