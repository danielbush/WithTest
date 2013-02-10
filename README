Unitjs
======

A small, flexible testing framework for javascript and optionally the
browser.

Why?
----
* You can create nested sections of tests
* Nice, "lispy" with_tests(...) function for creating sections and subsections of tests

Example:
--------

This will execute some tests stored in nested sections:
```js
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

See 05.data.js for the format of <code>tests</code>.

You can print results like this:

```js
var node = print(tests);
document.body.appendChild(node); // Or whatever you like.
```


Set up
------

See examples/index.html for setting up in the browser when developing unitjs.
For creating a single file, see build/*.list files. Concatenate ext files then main files.  Separately make available any files in assets.list.
