# UnitJS - a unit testing framework for javascript

UnitJS is simplified unit testing framework.  It was originally based
on JSUnit.net.  By intention, it does not have a lot of the added
features of JSUnit.

I wanted something simple which I could then hack into more
complex or automated solutions as I required.

UnitJS's main purpose is to allow you to write and organise
your tests and run them in some desired order.

Most of the actual assertion code comes from the original JSUnit
project.  How assertions are composed into tests and how tests
are further organised and results calculated is the original
work of unitjs.

## Notable features about unitjs:

- it uses test labels; every test has to be labelled (alphanumeric eg
  `a001` is good)
- every test belongs to a section; the simplest setup is to write
  all your tests under one section
- however it makes it easy to organise your tests further into subsections,
  and sub-subsections etc including aggregating multiple test modules
  in multiple files into one big test summary
- it encourages separation of test statements from test definitions
  (your actual tests).  You can write your tests (test definitions)
  next to their statements as well, but unitjs tends to encourage the
  separation; this stems from a preference of the unitjs author to put his
  statements all in one spot so that they can be easily read and
  annotated; this is just a preference
- test results are generated in a standard format that can be
  easily converted to JSON and distributed for analysis to other parties;
  you could write your own "printer" to display them; unitjs provides
  a default printer in `lib/printers/default`.
 
## Note on browser compatibility

This version of unitjs (v0.5.0) is a total rewrite of the previous
version.  It has only been tested in fairly recent versions of
firefox, IE (8), safari, chrome, opera.  IE 6-8 fail on
assertContains.  IE6 appears to be able to run tests and calculate
totals properly but does not render the results using the default
printer terribly well - this appears to be a css issue with
the default printer. 

## GETTING STARTED

Go to `examples/blank` and copy to your js project:

        cp -a examples/blank/ path/to/your/project/tests

To get a feeling for what unitjs can do, load up
`examples/full/index.html` and examine the tests.js file.
You should see how it is relatively straight-forward to
lay out test cases in sections and then examing particular
instances of those test cases in subsections.

Then read the following...

## How unitjs works

In the following, refer to `examples/blank` and `examples/full`.
Details such as how each part of unitjs is referenced and
set up is shown there.

Also note there is an appendix at the bottom of this file
which describes the data formats used by unitjs.  The
heart of unitjs are its formats for defining tests and
for representing the results of those tests.

### Create test module in a file

You create a test module in a file (eg tests.js);
this module will house both your test statements and your
test definitions (tests):

      test_module = function(){
          var module = {}
          ...
          return module;
      }();

- You can have more than one module in a file; the important
  thing is the name you use for your module so that
  you can reference it later and pass it to unitjs's
  `run` function (we will call our test module `test_module`).
- It makes sense to restrict yourself to one test module
  per file
- If you subscribe to the commonjs module system, you might
  want to use `exports` in place of `module`

### Write your test statements

Inside `test_module`, you create a series of `test statements` like this:

      module.statements = {
          section:'when inserting spaces...',
          a001:'refuse to insert if there is a space to our right',
          a002:'refuse to insert if there is a space to our right',
          ...
          d000:{
              section:'when there is a space to our left...',
              d001:'fail if user presses key X',
              d002:'delete if user presses key Y',
              ...
          },
          ...
      };

Notes

- a series of test statements is referred to as either a `section`
  or your `test statements`;
- `sections` may contain nested `sections` as illustrated by
  `d000` in the above example; these latter are
  sometimes referred to as `subsections`
- we use javascript object literals to represent `test statements`;
- the keys of the hashes are referred to as `labels` eg `a001`
- `labels` are generally processed in lexicographical order
- each `section` must have a `section` field which describes
  that section
- we haven't actually written any tests (`test definitions`) yet
- you can write `inline test definitions` alongside your statements
  like this:

      module.statements = {
          ...
          a011:{
              test:'test statement',
              fn:function(){...)
          },
          ...
      };

- if you don't define your tests in your `test statements`, you'll
  need to define them in a separate `test definitions` object which is
  what we'll cover next...


### Write your test definitions

I like to be able to see my `test statements` all in one spot.
So I tend to avoid `inline test definitions` and define my
`test definitions` separately (unitjs is pretty much geared
to work this way).  You do this by creating a `tests`
object that should usually come after your `section` object (all
within `test_module`).

      module.tests = {
          a001:function(){...},
          ...
          d000:{
              d001:function(){...},
              ...
          }
          ...
      };

Notes:

- unitjs uses the `labels` in your `test statements`
   (`module.statements`) to find the right test in `module.tests`.
- `tests` should mirror the structure of your `test statements` in
  `section`; if there are several nested levels, `tests` should have
  the same nesting and the same labelling (unless you've opted to
  write inline tests)
- I have no problem separating my statements from my tests; editors
  like vim and emacs make it easy to split the view between your
  `test statements` and your `test definitions`; in practice I've found
  this to not be too cumbersome but it may depend on your editor skills
- the thing that binds your statements to your tests are your `labels`
- unitjs will let you know if there is any mismatch between your
  `test definitions` and your `test statements`; tests that aren't
  referenced in your `test statements` will appear as errors in your
  test results; `test statements` that don't have a corresponding
  test will have a status of "unimplemented".  It is considered an
  error to have both an inline test definition and a non-inline
  definition.

#### Assertions

Assertions are mostly taken from the original JSUnit project
and can be found in the `unitjs.assertions` module.

The most common ones are `assert` and `assertEquals` especially the
latter.  Concision is a highly desirable thing if you write lots of
tests so I often shorten `assertEquals` to `E` eg `E(2,1+1)`.

See `examples/full` for example usage.

#### Tags

You can add a description to most assertions which will be
displayed if something goes wrong.  Internally, unitjs
represents this as a `comment` field in the `results` object
that is produced.

For example `E("1+1 should be 2",2,1+1)`.

## Running tests

To run your tests you do:

    results = run(test_module);

where `test_module.test_statements` and `test_module.test_defintions`
are the statements and tests we defined in our `test module` and `run`
is in the unitjs`runner` module.

`run` actually consists of several major functions that can
be found in the `runner` module:

- `validate(test_statements) => test_statements`
  - walks through all test statements and verifies they are of
    the correct form
- `prepare(test_statements,test_defintions) => prepared_test_statements`
  - walks through your `test definitions` and adds them
    to your `test statememnts` (`section`) thereby making all your
    test definitions have inline tests
  - missing test statements (`tests definitions` that
    don't belong to a `test statement`) are picked up at this point
- `process(prepared_test_statements) => results`
  - takes your prepared `test statements` and executes their
    tests
  - generates a `results` object which mirrors the structure
    of your `test statements`
  - at this point, each test now has a `stats` object counting
    the number of assertions executed and the status of the
    test: PASS, FAIL, ERROR, and several other possible outcomes
- `total(results) => results`
  - takes the output of `process` and summarises key test
    statistics for each `section`;
    each section gets a `stats` object that summarises number
    of tests, passes, fails etc;
  - each `section` also gets a `cumulative` object that summarises
    number of tests, passes, fails etc for that `section` and
    all its subsections including their subsections etc
      
### Results

As mentioned in the preceding section, `results` is a javascript object
that mirrors the structure of your `test statements`.  At this point
you could "print" the results using an html printer which will
be discussed below.  But there are other things you could do.  
You could serialize `results` into JSON and send it to a developer for
them to print and analyze the `results` on their browser.  If you use
an editor like emacs, it might be possible to execute tests, convert
`results` to JSON and pass these back to emacs where it can process
the JSON in a buffer.  This would be one way to do autotesting.

Another possibility is that you could perform tests using a framework
that is capable of generating the `results` format and get the
unitjs default printer or some other browser based printer
to display the results in a presentable way.  

## Printing tests

Unitjs provides a default printer in `lib/printers/default` which
takes `results` as produced by `run` (see above) and prints them as a
series of nested html sections with an outer div.

    var div = print(results)

You can then append this div where you wish in your document.

See `examples/blank`.


## Combining test modules

We mentioned that a good habit is to have one `test module` per
file.  You can however, combine several such `test modules` into
one big super `test module`.   You might want to do this if you
want to see all your test modules together.

First you need to reference all the `test modules` in your html
file so that they are all loaded and ready to use.
Suppose we have 3 whose module names are: A,B,C.

Then, after these, create a new `test module` D; make sure
that A,B,C are already loaded before D is loaded.
Define D like so:

    D = function() {
        var module = {};

        module.statements = {
          section:'all my tests together!',
          a001: A,
          b001: B,
          c001: C
        }

        return module;
    }();

Notes:

- obviously, you can use whatever `labels` you like
- it is fairly easy to construct any type of hierarchy to
  represent how you want to organise your test modules;
  this is another variation:

        D = function() {
            section:'all my tests together!',
            a001: A,
            b000: {
                b001:B,
                b002:C
            }
        }

- there should be an example of combining several modules
  in `examples/`

## Logging

Unitjs comes with a logger.
For details on how to use it see https://github.com/danielbush/jslogger .
It is included in `example/blank`.

### Pretty printing

Logger has a pretty printer that allows you to print objects
recursively.  The current version of logger sets the degree of
nesting used by the printer to 2 (this may change if we update
the logger).  Example of how to alter this is shown in `example/blank`.


## License

Unitjs is distributed under the GPL license; a copy is included
in the file LICENSE.

## Appendix: Data Formats

Example formats below are written out in pseudo javascript.
(We could have been more precise and use BNF).

### Test module

Test modules take this form:

      {
        statements: <test-statements>,
        tests: <test-definitions>
      }

Notes:

- you usually wrap these inside a module in a file like this:

      test_module = function(){
          var module = {};
          module.statements = ...
          module.tests = ...
          return module;
      }();

- <test-statements> is defined next...


### Test statements

Test statements (aka a `section`) take this form:

      {
        section:'section name',
        setup:function(){...},
        teardown:function(){...},
        label1:'statement for a test',
        label2:{
            test:'statement for a test',
            fn:function(){... <test-definition> ...}
        },
        label3:{
          section:'section name',
          label5:'statement for a test',
          ...
        },
        label4: <test-module>, // See below
        ...
      }

Notes:

- `label1` is a simple test statement
- `label2` is an `inline test statement`; this includes both
   the `test statement` and `test definition`
- `label3` is a new set of `test statements` (sometimes referred
  to as a `subsection`)
- `label4` is a `test module`
- You can have as many of the above as you please; you can
  arbitrarily nest `subsections` although to be reasonable, you
  probably don't want to exceed a depth of 2-3
- `setup`/`teardown` are optional functions that you can set;
  they will be called before and after each test in that section;
  they are not called on any of the section's descendent subsections.


### Labels

I tend to use alphanumeric formats but simpler formats are ok as well.

There are some labels you should not use in your `test statements`
as they are reserved by unitjs for other purposes.  These include:

      section
      stats
      cumulative
      test
      fn

### Test definitions

Test definitions take this form:

      {
          label1:function(){...},     // basic test
          label2:{                    // subsection
              label3:function(){...}  // basic test
          },
          ...
      }

Notes:

- `label1` is a basic test definition
- `label2` represents a `subsection`

### Results Object

`Results` objects take this format:

      {
        section:'section name',
        stats:{
            pass:0,
            fail:0,
            error:0,
            tests:0, // a total
            no_assertions:0,
            not_implemented:0,
            missing_statements:0
        },
        cumulative:{
            pass:0,
            fail:0,
            error:0,
            tests:0, // a total
            no_assertions:0,
            not_implemented:0,
            missing_statements:0
        },
        label1:{
            test:'statement for a test',
            stats:{
              status:<string>,
              assertions:<string>,
              unitjs:<string>,   // additional info provided by unitjs
              message:<string>,  // error message by thrown error
              comment:<string>,  // comment (tag) from first failed assertion
              stack:<string>     // stack trace if available
            }
        },
        label2:{
          section:'section name',
          stats:{...},
          cumulative:{...},
          label1:{...},
          ...
        },
        ...
      }

Notes:

- each `label` either represents a test result (`label1`) or a
  `subsection` (`label2`)
- sections and subsections have
  - a `stats` field that summarises the results for the tests
    in that section
  - a `cumulative` field that summarises the results for
    the section and all its descendent subsections

