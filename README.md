Unitjs
======

A small, flexible testing framework for javascript and optionally the
browser.

Examples:
--------
Go run examples/index.html in your browser.

Summary:
--------

Suppose we're building a graph data structure.
We'd do something like this:

```js
var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;
var it          = $dlb_id_au$.unitJS.shoulds.it;
var error_for   = $dlb_id_au$.unitJS.shoulds.error_for;

var tests = with_tests("Data-structure tests",function(M){

  // Note: M.tests => "a group tests".
  // (You can nest these arbitrarily.)

  M.tests("describe Graph",function(M){

    M.tests("when adding vertices",function(M){
      // An actual test is made by called M.test.
      M.test('it should do blah',function(){
        var a = true;
        var b = " foo ";
        it(a).should.be(true);
        it(b).should.match(/foo/);
      });
    });

    M.tests("when adding edges",function(M){
      M.test('it should do foo',function(){
         ...
      });
    });

  });

  // Here's an outer test not inside the nested section.
  M.test('test 1',function(){
    var a = true;
    it(a).should.be(true);
  });
});
```

The above style of test-writing:
```
  describe ..
    when ...
      it should ...
      we can do...
      I should be able to do...
    it should ...
    .. etc ...
```
seems to be a very good way to test only what you need to test
and write code for what you need to do :)


* See 05.data.js for the format of <code>tests</code>.
    * Also do console.log(tests) to see the format.
    * <code>with_tests</code> is just building a tree of 'tests' and 'test' data structures with a root 'tests' data structure ('section 1' in the above).

* 10.shoulds.js replaces 10.assertions.js which is being deprecated.

You can print results like this:
```js
var print  = $dlb_id_au$.unitJS.print.print;
var node = print(tests);
document.body.appendChild(node); // Or whatever you like.
```

Assertions
------
See 10.shoulds.js for the assertions that are currently available.
```js
  it(a).should.be(...);
  it(a).should.not_be(...);
  it(a).should.exist(...);
  it(a).should.not_exist(...);
  it(a).should.match(...);
  it(a).should.not_match(...);
```

Catching errors:
```js
  var e = error_for(fn);
  it(e).should.exist();
  it(e.message).should.be("Your error message");
  // etc
```

Older style assertions are still supported.
These are in 10.assertions.js.  This will be removed at some point.
These types of assertions are bound to the ```this``` keyword
in the test.


Set up
------

See examples/index.html for setting up in the browser when developing unitjs.
For creating a single file, see build/*.list files. Concatenate ext files then main files.  Separately make available any files in assets.list.

Setup / Teardown
--------------------------
Setup and teardown functions are added to test sections.
Nested sections inherit the parent section's setup/teardown functions.
```js
var tests = with_tests('section 1',function(M){
  M.setup(function(){
    return {
      foo:true
    };
  });
  M.teardown(function(o){
    o.foo = false;
  });
  M.test('test 1',function(o){
    this.assert(o.foo);
  });
  M.tests('section 1.1',function(M){
    M.test('test 2',function(o){
      this.assert(o.foo);  // Inherits.
    });
  });
  M.tests('section 1.2',function(M){
    M.setup(function(){  // Override.
      return {
        bar:true
      };
    });
    M.test('test 2',function(o){
      this.assert(o.bar);
    });
  });
});
```

Multiple test modules and aggregating tests
-------------------------------------------
Instead of using 

    tests = with_tests('my tests...',function(M){...});

which will run your tests on the spot, you can use:

    tests = with_tests$('my tests...',function(M){...});

This version produces the same object, but does not run the tests.
To run them, you'll need to:

    var run  = $dlb_id_au$.unitJS.run.run;
    run(tests);

This will then walk through all the tests and execute them and update the stats.

You can then continue as before:

    var print  = $dlb_id_au$.unitJS.print.print;
    var node = print(tests);
    document.body.appendChild(node); // Or whatever you like.

Now suppose we have several such untested modules:
```js
  m1 = with_tests$('my tests 1...',function(M){...});
  m2 = with_tests$('my tests 2...',function(M){...});
```
Now what we can do is this:
```js
  var data = $dlb_id_au$.unitJS.data;
  var tests = data.makeTests(); 
  tests.name = 'All tests';
  tests.items.push(m1);
  tests.items.push(m2);
  run(tests);
  ...
```
So what we've done here is create a super test module called 'tests'.
We've then made m1 and m2 sections within it.

