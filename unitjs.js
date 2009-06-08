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
 *
 * ============================================
 * This file is an implementation of the
 * interfaces in unitjs.interfaces.js which
 * define how the key components of the unitjs
 * system can interact.
 * For documentation, see unitjs.interfaces.js
 * ============================================
 *
 */

$web17_com_au$.unitJS = function() {

  var module={};

  var _UNDEFINED_VALUE;

  // A Stats instance is stored here and updated
  // by assertions when running tests.

  var STATS = null;

  /*
   * Stats object.
   * ---------------------------------------------------
   *
   */

  var Stats = function() {

    var me=this;

    // Global test/assertion stats
    me.tests=0;
    me.failed_tests=0;
    me.errored_tests=0;
    me.assertions=0;  // Total number of assertions executed.

    me.section={};
    me.section.name=null;
    me.section.tests = 0;
    me.section.failed_tests = 0;
    me.section.errored_tests = 0;
    me.section.assertions = 0;
    me.section.reset = function() { 
      me.section.name=null;
      me.section.tests=0;
      me.section.failed_tests = 0;
      me.section.errored_tests = 0;
      me.section.assertions = 0;
    }

    // The current test stats
    me.current={};
    me.current.test_name=null;
    me.current.assertion_count=0;
    me.current.assertion_level=0;
    me.current.reset = function() {
      me.current.test_name=null;
      me.current.assertion_count=0;
      me.current.assertion_level=0;
    }

    me.merge = function(stats) {
      me.tests         +=stats.tests;
      me.failed_tests  +=stats.failed_tests;
      me.errored_tests +=stats.errored_tests;
      me.assertions    +=stats.assertions;

      me.section.tests         +=stats.section.tests;
      me.section.failed_tests  +=stats.section.failed_tests;
      me.section.errored_tests +=stats.section.errored_tests;
      me.section.assertions    +=stats.section.assertions;
    }

  }


  /*
   * Runner submodule
   * ---------------------------------------------------
   *
   */

  module.runner = function() {

    var runner = {};

    runner.setup = null;
    runner.teardown = null;

    // If you invoke without nested, nested will be treated
    // as false and runnuer.run assumes it is running as 
    // standalone and will print stats.

    runner.run = function(testOrder,tests,printer,nested) {

      var stats = new Stats();

      // Run the tests and print to screen...

      for ( var i=0; i<testOrder.length; i++ ) {
        var test_name=testOrder[i];

        try {
          stats.tests++;
          stats.section.tests++;
          stats.current.reset();
          stats.current.test_name=test_name;
          STATS=stats; // So assertion code can update stats.
          // Pass stats in to the test mainly so I can test this framework
          // more easily.
          if (runner.setup) runner.setup();
          tests[test_name](stats);
          if (runner.teardown) runner.teardown();
          STATS=null;
          printer.printPass(i+1,test_name,stats);
        }

        catch(e) {
          if(e.isFailure) {
            stats.failed_tests++;
            stats.section.failed_tests++;
            printer.printFail(i+1,test_name,stats,e);
          }
          else {
            stats.errored_tests++;
            stats.section.errored_tests++;
            printer.printError(i+1,test_name,stats,e);
          }
          stats.current.reset();
        }

      }

      if(!nested) printer.printStats(stats);
      return stats;

    }

    runner.sections={};

    runner.sections.run = function(sections,printer,stats,level) {
      var s,section_printer,runner_stats;

      // Initialize STATS object for collecting stats.
      if(!stats) stats = new Stats();
      if(!level) level = 1;

      for(var i=0;i<sections.members.length;i++) {
        s = sections.members[i];
        section_printer = printer.subsection_printer( s.name );
        stats.section.name = s.name;
        runner_stats = runner.run(s.testOrder,s.tests,section_printer,true);
        stats.merge(runner_stats);

        if(level!=1) {
          section_printer.printSectionStats(runner_stats);
        }

        if(s.subsections.members.length>0)
          runner.sections.run(s.subsections,section_printer,stats,level+1);

        if(level==1) {
          section_printer.printSectionStats(stats);
          stats.current.reset();
          stats.section.reset();
        }

      }

      if(level==1) {
        printer.printStats(stats);
        return stats;
      }
    }

    return runner;

  }();



  /*
   * Sections and Section objects
   * ---------------------------------------------------
   *
   */

  module.Sections = function() {
    var me = this;
    me.members = [];
    me.add = function(name) {
      var s = new module.Section(name);
      me.members.push(s);
      return s;
    }
  }

  module.Section = function(name) {
    var me = this;
    me.name = name;
    me.subsections = new module.Sections();  // For subsections.
    me.testOrder=[];
    me.tests={};
  }

  /*
   * Assertions submodule
   * ---------------------------------------------------
   * _assert 
   *   - there is one private assertion: _assert
   *     which is usually called by all the other assertions
   *   - takes public assertion args and an additional arg provided by the assertion:
   *     assertionTypeMessage : a generic message shown at failure that identifies the assertion.
   *   - if the boolean test fails 'comment' and 'assertionTypeMessage' are 
   *     passed off to module.utils.fail and these are used to generate (throw)
   *     a failure error object
   * before_assert / after_assert
   *   These functions are run before and after each assertion.
   * NOTE!!!: there is some plumbing at the bottom which adds a wrapper
   *   to each public assertion:
   *
   */

  module.assertions = function() {

    var assertions={};

    function before_assert() {
      STATS.current.assertion_level++;
      if(STATS.current.assertion_level==1) {
        STATS.current.assertion_count++;
        STATS.assertions++;
        STATS.section.assertions++;
      }
    }

    function after_assert() {
      STATS.current.assertion_level--;
    }

    function _assert(comment, booleanValue, assertionTypeMessage) {
      if (!booleanValue) {
        module.utils.fail(comment, assertionTypeMessage);
      }
    }

    // Public assertions start here...

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
        module.utils.fail('',module.utils.commentArg(1, arguments));
    }

    assertions.assertEvaluatesToFalse = function() {
      module.utils._validateArguments(1, arguments);
      var value = module.utils.nonCommentArg(1, 1, arguments);
      if (value)
        module.utils.fail('',module.utils.commentArg(1, arguments));
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

    // Test if error object is a failure raised by an assertion.

    assertions.assertFailure = function(comment, errorObject) {
      assertions.assertNotNull(comment, errorObject);
      assertions.assert(comment, errorObject.isFailure);
      assertions.assertNotUndefined(comment, errorObject.comment);
    }

    // Test if error object is an error other than a failure
    // (indicating an error has been thrown which is not related
    // to an assertion/test).

    assertions.assertError = function(comment, errorObject) {
      assertions.assertNotNull(comment, errorObject);
      assertions.assertUndefined(comment, errorObject.isFailure);
      assertions.assertNotUndefined(comment, errorObject.description);
    }

    // Wrap public assertions with a wrapper that calls
    // before/after_assert etc

    for(var i in assertions) {
      var assertion;
      if(/^assert/.test(i)) {
        assertion=assertions[i];
        assertions[i] = function(assertion2) {
          return function() {
            before_assert();
            assertion2.apply(this,arguments);
            after_assert();
          };
        }(assertion);
      }
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

    // This functino is not useful when using anonymous or modularised
    // functions.  Deprecated.
    // -- DBush Sat May 16 22:27:34 EST 2009

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
    }

    utils.error = function(errorMessage) {
      var e = new Error(errorMessage);
      e.description = errorMessage;  // FIXME: Do we need this???
      throw e;
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


    return utils;

  }();

  return module;

}();
