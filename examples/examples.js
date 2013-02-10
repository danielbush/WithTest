
var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;
var with_tests$ = $dlb_id_au$.unitJS.with$.with_tests$;
var print       = $dlb_id_au$.unitJS.print.print;

// Example:
var tests;

tests = with_tests('section 1',function(M){
  M.tests('section 1.1',function(M){
    M.test('test a',function(){
      this.assert(true);
    });
  });
  M.test('test 1',function(){
    this.assert(true);
  });
});
//console.log(tests);


// Create your own testing with* function to make testing
// convenient.

var with_my_project = function(fn) {
  var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;
  var L = {
    lib1:{foo:true},
    lib2:{},
    with_tests:function(){
      L.tests = with_tests.apply(null,arguments);
      return L.tests;
    },
    tests:null
  };
  fn(L);
  return L.tests;
};

tests = with_my_project(function(L){
  L.with_tests('section A',function(M){

    M.tests('section A.1',function(M){
      M.test('test b',function(){
        this.assert(L.lib1.foo);
      });
    });

    M.test('test a',function(){
      this.assert('omg! failure!',false);
    });

  });
});

console.log(tests);
var node = print(tests);

var wid = window.setInterval(function(){
  if(document.body){
    document.body.appendChild(node);
    window.clearInterval(wid);
  }
},100);
