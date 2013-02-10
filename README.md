Unitjs
======

A small, flexible testing framework for javascript and optionally the
browser.

IMPORTANT
---------
* Unitjs has undergone a complete rewrite and simplification around 9-Feb-2013.
* Use old tag v0.6.0 for the old version.
* The rewrite still needs needs testing and refining.

Why?
----
* You can create nested sections of tests
* Nice, "lispy" with_tests(...) function for creating sections and subsections of tests

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
Note how we make <code>L</code> contain all or parts of our project as will as provide it with <code>with_tests</code>.
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
