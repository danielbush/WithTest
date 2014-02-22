
var data        = $dlb_id_au$.unitJS.data;
var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;
var with_tests$ = $dlb_id_au$.unitJS.with$.with_tests$;
var print       = $dlb_id_au$.unitJS.print.print;
var printButton = $dlb_id_au$.unitJS.print.printButton;
var toggleButton = $dlb_id_au$.unitJS.print.toggleButton;


// Example:
var all = data.makeTests(); 
var tests;

all.name = 'all tests';

tests = with_tests('setup/teardown inheritance... check console log',function(M) {

  M.setup(function(){
    console.log('setup OUTER called...');
    var o = {
      finished:false
    };
    return o;
  });
  M.teardown(function(o){
    console.log('teardown OUTER called...');
    o.finished = true;
    console.log(o.finished);
  });

  M.test("test standard setup/teardown",function(o){
    this.assertEquals(false,o.finished);
  });

  M.tests("nested set of tests with no setup/teardown...",function(M){
    M.test("we should inherit the setup",function(o){
      this.assertEquals(false,o.finished);
    });
  });

  M.tests("nested set of tests with own setup/teardown...",function(M){
    M.setup(null); // To disable setup inheritance.
    M.teardown(function(){
      console.log('teardown NESTED called...');
    });
    M.test("we shouldn't inherit the setup",function(o){
      this.assertEquals(null,o);
    });
  });

});

all.items.push(tests);


tests = with_tests("all the tests!!!",function(M) {

  M.tests("describe some passing tests",function(M){
    M.test('this test should pass',function(){
      this.assert(true);
    });
  });

  M.tests("describe some empty tests",function(M){
    M.test('this test should be blue',function(){
    });
  });


  M.tests("describe some unexpected test errors",function(M){
    M.test("this test should throw an unexpected error",function(o){
      this.assertEquals('True is true, right?',true,true);
      throw new Error('whoops');
    });
  });

  M.tests("describe some failing tests",function(M){
    M.test("this test should fail",function(){
      this.assert(true);
      this.assert('omg! failure!',false);
      this.assert(true);
    });
  });


});

all.items.push(tests);

var o = print(all);

var wid = window.setInterval(function(){
  if(document.body){
    try {
      document.body.appendChild(
        toggleButton('Tests shown',o.hideTests,'Tests hidden'));
      document.body.appendChild(
        toggleButton('Details shown',o.hideDetails,'Details hidden'));
      document.body.appendChild(
        printButton('Failed only',o.showOnlyFailed));
      document.body.appendChild(o.node);
    } finally {
      window.clearInterval(wid);
    }
  }
},100);
