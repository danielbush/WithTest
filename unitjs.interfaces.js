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
 * the visible and not-so-visible 'surfaces' of a
 * javascript project and how they interact without worrying
 * about implementation detail.
 *
 * To specify a return type, a return statement is sometimes
 * included in the function stub.
 *
 * Some terminology:
 *
 * 'not implementable' :
 *     this object is something you don't have to implement
 *     yourself.  This means that you can still use it as
 *     required but shouldn't try to write your own version.
 *     If you are a maintainer (as opposed to a user), you
 *     may of course decide to reimplement (or even change
 *     the implementation contract) by modifying the project
 *     itself.
 *
 *     Parts of a 'non implementable' thing can be marked
 *     as 'implementable'.
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
   * Test series
   * ----------------------------------------------------------------
   *
   * You define a series of tests using 2 objects:
   * tests     - a hash of test functions, hashed by their name or description
   * testOrder - the order of the tests (using an array)
   * You do this yourself and store them wherever you like.
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

  tests = { 'test 1':function(stats){} , 'test that X is Y':function(stats){} }
  testOrder = [ 'test 2' , 'test 1' ];


  /*
   * Stats Object (not implementable)
   * ----------------------------------------------------------------
   * Stats objects are generated for each test series or
   * each section representing a test series.
   *
   * section.*
   *   Section stats should store all stats for a section.
   *   Depending on how it is used, it may or may not
   *   include stats for subsections.
   *
   * section.reset()
   *   Should reinitialize all me.section.* data.
   *
   * current.*
   *   Stats for a single test.
   *   current.* should get reset using current.reset()
   *   prior to every test.
   *
   * current.assertion_level
   *   Public assertions may call eachother internally.
   *   We use this variable to help us track this.
   *   The actual assertion invoked by the user in a test has level=1;
   *   if this assertion calls other public assertions these will
   *   have level>1.
   *   When counting assertions we only count those with
   *   level=1.
   *
   * current.assertion_count
   *   Count of public assertions (excluding any with assertion_level > 1).
   *
   * current.reset()
   *   Should reinitialize all me.current.* data.
   *
   * merge
   *   Merge global and section-level stats with another
   *   stats object.  For instance, runner.run will create
   *   and return a stats object which you might want to
   *   merge into a global stats object.
   *
   */

  var Stats = function() {
    var me = this;
    me.tests = 0;         // Count all tests
    me.failed_tests = 0;  // Count failed tests
    me.errored_tests = 0; // Count tests which threw an error other than an assertion failure
    me.assertions = 0;    // Count the number of assertions called

    me.section={};
    me.section.name='section name';
    me.section.tests = 0;
    me.section.failed_tests = 0;
    me.section.errored_tests = 0;
    me.section.assertions = 0;
    me.section.reset = function() { }

    me.current={};
    me.current.test_name='test name';  // Name/description of current test
    me.current.assertion_level=0;
    me.current.assertion_count=0;
    me.current.reset = function() { }

    me.merge = function(stats) {}
  }



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
   * - When you use sections, the Section object contains
   *   instances of testOrder and tests object.
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
   *       See tests
   *   - testOrder
   *       See testOrder
   *   - subsections
   *       A section may have its own subsections.
   *       At any rate, me.sections should point to an
   *       object that implements the module.Sections interface.
   *   - calculateStats
   *       Sum stats for section and all its subsections.
   *   - stats
   *       Store instance of Stats object containing stats
   *       for this section.  Does not include subsections.
   *   - setup     [OPTIONAL,IMPLEMENTABLE]
   *       runner.sections.run will execute this before each test
   *       in this section
   *   - teardown  [OPTIONAL,IMPLEMENTABLE]
   *       runner.sections.run will execute this after each test
   *       in this section
   *   setup/teardown allows you to specify your own specific code
   *   for a given section; this is useful if you are running many
   *   sections each with different setup/teardown requirements.
   *   runner.setup/teardown will still be executed if it has also
   *   been set.
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
    me.stats = null;
    me.calculateStats = function(){ return new Stats(); }
    me.setup = function(){}
    me.teardown = function(){}
  }



  /*
   * Runner Interface  (not implementable)
   * ----------------------------------------------------------------
   *
   * A test runner does the job of running a series of tests
   * or test sections.
   * In unitJS it is not currently implemented as an object in its own right.
   *
   * - you can invoke runner.run or runner.sections.run directly in your html
   *   (eg using an input button) once you've set up the tests
   * - you'll also need to provide it with a printer object;
   *   unitJS provides one implementation: unitjs.printers.DefaultPrinter.
   *   See printer interface.
   *
   * - run()
   *     Run tests in the order specified by testOrder.
   *     Catch any errors and note if they are assertion failures or
   *     otherwise.
   *     Should be invoked without 'nested' parameter.
   *
   *     RETURNS
   *     Stats instance
   *
   *     PARAMETERS
   *     tests:     see tests/testOrder above
   *     testOrder: see tests/testOrder above
   *     printer:   an object the has the module.Printer interface
   *                It should print results usually into an html file.
   *     nested:    If false (or not specified), run()
   *                assumes it is in standalone mode.
   *                (In general leave this out as it is used
   *                internally)
   *     options:   a hash with various options;
   *                This was added after the nested parameter to prevent
   *                breakage in existing projects using this api (v0.3 or previous).
   *                It may get moved.
   *
   *                options.setup = function(){}
   *                options.teardown = function(){}
   *                  This was created to allow the runner.sections.run to
   *                  pass in a setup/teardown functions specific to a
   *                  section.
   *                  It will be run in addition to runner.setup/teardown
   *                  if the latter is also set.
   *
   *
   * - sections.run()
   *     Run tests for each section in 'sections'.
   *     Should be invoked initially by the user
   *     without the 'level' parameter.
   *   
   *     The unitJS implementation will invoke module.run on
   *     each section in 'sections' using section.tests
   *     and section.testOrder as parameters.
   *
   *     When recursing, this function will increment the
   *     level.
   *
   * - setup()        (IMPLEMENTABLE)
   *     Global setup function for this runner.
   *     Run before every test.
   * - teardown()     (IMPLEMENTABLE)
   *     Global teardown function for this runner.
   *     Run after every test.
   *
   *
   */

  module.runner = function() {
    var module = {};

    module.run = function(
        testOrder,
        tests,
        printer,
        nested,
        options){ return new Stats() }

    module.sections={};
    module.sections.run = function(
        sections,
        printer,
        level){}

    module.setup = function(){};       // Implementable.
    module.teardown = function(){};    // Implementable.

    return module;
  }();




  /*
   * Printer Interface (implementable)
   * ----------------------------------------------------------------
   *
   * A printer object is used by a test runner
   * to print the results of the tests it runs.
   *
   * PARAMETERS
   * parentNode : the parent node we should attach our results to.
   * label      : Optional description that will be shown at the top before the tests.
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
   *
   *  - section_printer
   *
   *      RETURNS
   *      An object that implements the printer interface.  
   *
   *      PARAMETERS
   *      section_name : Name/description of section
   *
   *      It will get called by runner.sections.run() for
   *      each section it encounters.  runner.sections.run
   *      will then pass this as the printer to runner.run
   *      when running the tests for that section. 
   *
   *      You may decide to return the same instance or to
   *      create a new instance of the printer interface.
   *      Be aware that you must be able to handle nesting
   *      of sections to abitrary levels.
   *
   *      This function is designed to help you implement
   *      nested subsections in html output.  For instance,
   *      'parentNode' of newly generated section_printer
   *      instances could be set to a nested section div
   *      element rather than the main testing div element.
   *
   *  - updateSectionStatus
   *
   *      Instruct the printer to update itself with the
   *      latest stats for the section it is handling.
   *      The printer may want to visually display that the
   *      section or test series it is responsible for has
   *      >0 failed or errored tests or has passed all
   *      tests.  This is something it only knows after
   *      having printed all the test results out via
   *      runner.run.
   *
   *      runner.sections.run will invoke this method on
   *      each section's section_printer after runner.run.  
   *
   */

  module.Printer = function(parentNode,label) {
    var me = this;
    me.printPass = function(num,test_name,stats){};
    me.printFail = function(num,test_name,stats,e){};
    me.printError = function(num,test_name,stats,e){};
    me.printStats = function(stats){};
    me.section_printer = function(section_name){ 
      return new module.Printer(parentNode,label); 
    };
    me.updateSectionStatus = function(stats){}

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
    me.isFailure = true;             // Flags this as being an assertion failure (as opposed to some other error)
    me.comment = 'test_name';        // The name or description of the test.
  }

  /*
   * Assertions submodule  (NOT IMPLEMENTABLE)
   * ---------------------------------------------------
   * Contains all assertions you can use in your tests.
   *
   *   PARAMETERS
   * - generally take 1 or 2 args
   *   1) comment : a user comment shown at failure [optional]
   *   2) a boolean value representing a test result
   *
   */

  module.assertions = function() {

    var assertions = {};

    assertions.assert = function() {}
    assertions.assertTrue = function() {}
    assertions.assertFalse = function() {}
    assertions.assertEquals = function() {}
    assertions.assertNotEquals = function() {}
    assertions.assertNull = function() {}
    assertions.assertNotNull = function() {}
    assertions.assertUndefined = function() {}
    assertions.assertNotUndefined = function() {}
    assertions.assertNaN = function() {}
    assertions.assertNotNaN = function() {}
    assertions.assertObjectEquals = function() {}
    assertions.assertEvaluatesToTrue = function() {}
    assertions.assertEvaluatesToFalse = function() {}
    assertions.assertHTMLEquals = function() {}
    assertions.assertHashEquals = function() {}
    assertions.assertRoughlyEquals = function() {}
    assertions.assertContains = function() {}
    assertions.assertFailure = function(comment, errorObject) {}
    assertions.assertError = function(comment, errorObject) {}

    return assertions;
  }();


  return module;

}();

