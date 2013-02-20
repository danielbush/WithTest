Unitjs
======

A small, flexible testing framework for javascript and optionally the
browser.

IMPORTANT
---------
* Unitjs has undergone a complete rewrite and simplification around 9-Feb-2013.
* Use old tag v0.6.0 for pre-Feb-2013
* The new unitjs starts from tag v0.9.0
    * The rewrite still needs needs testing and refining.

Why?
----
* You can create nested sections of tests
* Nice, "lispy" with_tests(...) function for creating sections and subsections of tests
* Included is a "printer" which takes test results and "prints" them to the DOM along with some functions to selectively filter.
    * See examples/index.html

Example:
--------
Go run examples/index.html in your browser.

This will execute some tests stored in nested sections:
```js
var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;

var tests = with_tests('section 1',function(M){
  M.tests('section 1.1',function(M){
    M.test('test a',function(){
      this.assert(true);
    });
  });
  M.test('test 1',function(){
    this.assert(true);
  });
});
```

* See 05.data.js for the format of <code>tests</code>.
    * Also do console.log(tests) to see the format.
    * <code>with_tests</code> is just building a tree of 'tests' and 'test' data structures with a root 'tests' data structure ('section 1' in the above).
* See 10.assertions.js for the assertions that are currently available.
* Assertions are bound to <code>this</code> inside your test functions.

You can print results like this:
```js
var print  = $dlb_id_au$.unitJS.print.print;
var node = print(tests);
document.body.appendChild(node); // Or whatever you like.
```

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

This will then walk through all the tests and execute them and update the stats.  You can then continue as before:

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

Extending for your project
--------------------------

I really like this pattern:
```js
var with_my_project = function(fn) {
  var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;
  // Create some wrapper object that contains all the libs/modules you
  // you want to test.
  // And include with_tests.
  var L = {
    lib1:{foo:true},
    lib2:{},
    with_tests:function(){
      L.tests = with_tests.apply(null,arguments);
    },
    tests:null
  };
  fn(L);
  return L.tests;
};
```

Then you can execute tests on the spot using this function.
Note how we make <code>L</code> contain all or parts of our project as well as provide it with <code>with_tests</code>.
```js
with_my_project(function(L){
  L.with_tests('section 1',function(M){

    M.tests('section 1.1',function(M){
      M.test('test b',function(){
        this.assert(L.lib1.foo);
      });
    });

    M.test('test a',function(){
      this.assert(false);
    });

  });
});
```

