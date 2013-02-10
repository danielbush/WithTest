
var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;
var with_tests$ = $dlb_id_au$.unitJS.with$.with_tests$;

// Example:

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
console.log(tests);


/*

// Create your own testing with* function to make testing
// convenient.

with_my_project = function(fn) {
  var o = {
    lib1:{foo:true},
    lib2:{},
    with_tests:with_tests
  };
  fn(o);
};

with_my_project(function(L){
  L.with_tests('section 1',function(M){
    M.test('test a',function(){
      this.assert(L.lib1.foo);
      this.assert(true);
    });
  });
});


*/
