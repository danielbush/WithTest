/* 
 * This is a source file for UnitJS a unit testing framework
 * for javascript.
 * Copyright (C) 2009 Daniel Bush
 * This program is distributed under the terms of the GNU
 * General Public License.  A copy of the license should be
 * enclosed with this project in the file LICENSE.  If not
 * see <http://www.gnu.org/licenses/>.
 *
 */

/* 
 * Interfaces module
 * ----------------------------------------------------------------
 *
 * WARNING: this file is not meant to be run although it is
 * written in javascript.  It intends to show the key object
 * interfaces for this project.
 *
 * An attempt is made to present the elements in a logical
 * order progressing from base elements to more complex
 * ones.
 *
 * Unlike with Java, the interfaces may include fields and
 * there is no compiler or strong typing to enforce the
 * contract on parameters and return values for functions
 * and methods.
 * Despite this, interfaces are an excellent way to document
 * the visible and not-so-visiable 'surfaces' of a
 * javascript project and how they interact without worrying
 * about implementation detail.
 *
 * To specify a return type, a return statement is sometimes
 * included in the function stub.
 *
 * Some terminology:
 *
 * 'not implementable' :
 *     this object is not something you should implement
 *     yourself.  This means that you can still use it as
 *     required but shouldn't try to write your own version.
 *     If you are a maintainer (as opposed to a user), you
 *     may of course decide to reimplement (or even change
 *     the implementation contract) by modifying the project
 *     itself.
 *
 * 'implementable' :
 *     you (as the user) can implement your own if you want
 *     and then plug your implementation into the system.
 *     The project should provide documentation on how to do
 *     this.
 *
 */

$web17_com_au$.unitJS.interfaces = function() {

  var module = {};

  /*
   * Test series (not implementable)
   * ----------------------------------------------------------------
   *
   * We define a series of tests using 2 objects:
   * tests     - a hash of test functions, hashed by their name or description
   * testOrder - the order of the tests (using an array)
   *
   * 'test functions' are the tests that you write; they
   * usually contain one or more assertions.  See
   * module.assertions.* below.
   *
   * 'test functions' are passed an instance of Stats
   * although you shouldn't mess with it in your tests
   * normally.  It was put it in there to help with testing
   * the framework using itself.
   *
   * If a 'test function' throws an error or failure it will
   * be caught and noted by the runner.  No special return
   * value is assumed.
   *
   * NOTE: test names/descriptions must be unique.
   *
   */

  module.tests = { 'test 1':function(stats){} , 'test that X is Y':function(stats){} }
  module.testOrder = [ 'test 2' , 'test 1' ];



  /*
   * Sections and Section Interfaces (not implementable)
   * ----------------------------------------------------------------
   *
   * - Sections allow you to group Section objects.
   * - Section objects allow you to group and describe a series of tests.
   *   You'll want to use these to break up a large series of tests
   *   into several smaller series.
   *   Then use unitJS.runner.sections.run() to run through
   *   all the Section objects in a Sections object to
   *   run the tests.
   * - When you run tests without any sectioning, you
   *   use testOrder and tests objects directly.
   * - When you use sections, a Section object now contains
   *   a testOrder and tests object.
   *
   * Sections
   *   - members
   *       Array of Section instances.
   *   - add
   *       Create and add a Section object with 'name'
   *       to Sections.
   *       Must return the created section.
   *
   * Section
   *   - name
   *       Name/description of section
   *   - tests
   *       See module.tests
   *   - testOrder
   *       See module.testOrder
   *   - subsections
   *       A section may have its own subsections.
   *       At any rate, me.sections should point to an
   *       object that implements the module.Sections interface.
   * 
   *
   */

  module.Sections = function() {
    var me = this;
    me.members = [];
    me.add = function(name) { return new Section(name); }
  }

  module.Section = function(name) {
    var me = this;
    me.name = name;              
    me.tests = {};               
    me.testOrder = [];           
    me.subsections = new module.Sections();
  }



  /*
   * Runner Interface  (not implementable)
   * ----------------------------------------------------------------
   *
   * A test runner does the job of running a series of tests
   * or test sections.
   * In unitJS it is not currently implemented as an object in its own right.
   *
   * - you can invoke runner.run directly in your html
   *   (eg using an input button) once you've set
   *   up the tests
   * - you'll need to provide it with a printer object;
   *   unitJS provides one implementation: unitjs.printers.DefaultPrinter.
   *   See printer interace.
   *
   * - run()
   *     Run tests in the order specified by testOrder.
   *     Catch any errors and note if they are assertion failures or
   *     otherwise.  Update stats.
   *
   *     If invoking directly (not via me.sections.run()) then do NOT
   *     include 'stats'.  run() will then instantiate its own stats
   *     instance and get the printer to print the stats.
   *     If run() is passed stats, it will assume it is
   *     running in a section and will not print stats.
   *
   *     PARAMETERS
   *     tests:     see tests/testOrder above
   *     testOrder: see tests/testOrder above
   *     printer:   an object the has the module.Printer interface
   *                It should print results usually into an html file.
   *     stats:     A Stats object instance
   *
   * - sections.run()
   *     Run tests for each section in 'sections'.
   *   
   *     The unitJS implementation will invoke module.run on
   *     each section in 'sections' using section.tests
   *     and section.testOrder as parameters.
   *
   *     Should be invoked without stats and level parameters.
   *     When recursing, this function will pass relevant objects
   *     and values for these parameters.
   *
   *
   */

  module.runner = function() {
    var module = {};
    module.run = function(testOrder,tests,printer,stats){}
    module.sections={};
    module.sections.run = function(sections,printer,stats,level){}
    return module;
  }();




  /*
   * Printer Interface (implementable)
   * ----------------------------------------------------------------
   *
   * A printer object is used by a test runner
   * to print the results of the tests it runs.
   *
   *
   * Printer
   *  - print*
   *      Print that the test passed, failed or threw an error
   *      PARAMETERS
   *      num       : the ordinal number of the test
   *      test_name : name or description of the test
   *      stats     : a Stats object instance, used for collecting stats in unitJS
   *      e         : error object; for printFail this should be the unitJS
   *                  failure object.
   *  - subsection_printer
   *      Return an object that implements this 
   *      interface.  
   *
   *      PARAMETERS
   *      section_name : Name/description of section
   *
   *      It will get called by runner.sections.run(sections)
   *      if a section in 'sections' has its own set of subsections. 
   *
   *      You may decide to return the same instance or to create
   *      a new instance.  Be aware that you must be able to 
   *      handle nesting of subsections to abitrary levels.
   *
   *      This function is designed to help you implement 
   *      nested subsections in html output.
   *      For instance, 'parentNode' can be set to a section div
   *      element rather than the main testing div element.
   *      Don't forget to ensure id is unique if you use it.
   *
   */

  module.Printer = function(parentNode,id,label) {
    var me = this;
    me.printPass = function(num,test_name,stats){};
    me.printFail = function(num,test_name,stats,e){};
    me.printError = function(num,test_name,stats,e){};
    me.subsection_printer = function(section_name){ 
      return new module.Printer(parentNode,id,label); 
    };

  }


  /*
   * Stats Object (not implementable)
   * ----------------------------------------------------------------
   *
   * current.*
   *   Current = stats for a single test.
   *   current should get reset using current.reset() prior to every test.
   *
   * current.assertion_level
   *   Public assertions may call eachother internally.
   *   We use this variable to help us track this.
   *   The actual assertion invoked by the user in a test has level=1;
   *   if this assertion calls other public assertions these will
   *   have level>1.
   * current.assertion_count
   *   Count of public assertions (excluding any with assertion_level > 1).
   * current.reset()
   *   Should reinitialize all me.current.* data.
   *
   */

  module.Stats = function() {
    var me = this;
    me.tests = 0;         // Count all tests
    me.failed_tests = 0;  // Count failed tests
    me.errored_tests = 0; // Count tests which threw an error other than an assertion failure
    me.assertions = 0;    // Count the number of assertions called
    me.current={};
    me.current.test_name='test name';  // Name/description of current test
    me.current.assertion_level=0;
    me.current.assertion_count=0;
    me.current.reset = function() { }
  }



  /*
   * Failure Object (not implementable)
   * ----------------------------------------------------------------
   *
   * Usually implemented as an instance of javascript's error object
   * (e = new Error(message)), with some
   * additional attributes set before throwing (throw e).
   *
   */

  module.Failure = function(assertionMessage) {
    var me = this;
    me.message = assertionMessage;   // Eg for assertEquals: "Expected <a> but got <b>." 
    me.isFailure = true;             // Flags this as being
    me.comment = 'test_name';        // The name or description of the test.
  }

  /*
   * Assertions submodule
   * ---------------------------------------------------
   * - contains all assertion code
   * - PUBLIC ASSERTIONS 
   *   - are named like 'assert*'
   *   - generally take 1 or 2 args
   *     1) comment : a user comment shown at failure [optional]
   *     2) a boolean value representing a test result
   *   - setup         : run before the assertion.
   *                     User can override and run their own.
   *   - teardown      : run after the assertion.
   *                     User can override and run their own.
   *
   */

  module.assertions = function() {

    var module = {};

    module.setup = function() {}
    module.teardown = function() {}

    module.assert = function() {}
    module.assertTrue = function() {}
    module.assertFalse = function() {}
    module.assertEquals = function() {}
    module.assertNotEquals = function() {}
    module.assertNull = function() {}
    module.assertNotNull = function() {}
    module.assertUndefined = function() {}
    module.assertNotUndefined = function() {}
    module.assertNaN = function() {}
    module.assertNotNaN = function() {}
    module.assertObjectEquals = function() {}
    module.assertEvaluatesToTrue = function() {}
    module.assertEvaluatesToFalse = function() {}
    module.assertHTMLEquals = function() {}
    module.assertHashEquals = function() {}
    module.assertRoughlyEquals = function() {}
    module.assertContains = function() {}
    module.assertFailure = function(comment, errorObject) {}
    module.assertError = function(comment, errorObject) {}

    return module;
  }();


  return module;

}();

