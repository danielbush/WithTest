
var data        = $dlb_id_au$.unitJS.data;
var with_tests  = $dlb_id_au$.unitJS.with$.with_tests;
var with_tests$ = $dlb_id_au$.unitJS.with$.with_tests$;
var print       = $dlb_id_au$.unitJS.print.print;
var printButton = $dlb_id_au$.unitJS.print.printButton;
var toggleButton = $dlb_id_au$.unitJS.print.toggleButton;

var it          = $dlb_id_au$.unitJS.shoulds.it;
var error_for   = $dlb_id_au$.unitJS.shoulds.error_for;

var all = data.makeTests(); 
var tests;

tests = with_tests("all the tests!!!",function(M) {

  M.tests("all tests here should be green",function(M){

    // Throw an error or bad assertion here to test...
    //
    // Uncomment one of these:
    //throw new Error("whoopsie!");
    //it(true).should.be(false);

    M.test('this test should pass',function(){
      this.assert(true);
      var a = true;
      var b = "1";
      it(a).should.be(true);
      it(a).should.not_be(false);
      it(b).should.be("1");
      it(b).should.not_be(1);
      it(null).should.be(null);
      it(false).should.be(false);
      it(undefined).should.be(undefined);
      it(null).should.not_be(false);
    });

    M.test("test array compare",function(){
      var a = [1,2,3];
      it(a).should.be([1,2,3]);
      it(a).should.not_be([1,2,3,4]);
      it(a).should.not_be([0,1,2,3]);
      var b = [1,[4,5],3];
      it(b).should.be([1,[4,5],3]);
    });

    M.test("test existence",function(){
      var a = 0;
      it(a).should.exist();
      a = null;
      it(a).should.not_exist();
      a = undefined;
      it(a).should.not_exist();
    });

    M.test("test matching",function(){
      it(" foo ").should.match(/foo/);
      it(" foo ").should.not_match(/bar/);
    });

    M.test("test error capturing",function(){
      var throwsfn = function() {
        throw new Error("this is expected");
      };
      var nothrowsfn = function() {
        return 1;
      };
      var e;

      e = error_for(throwsfn);
      it(e).should.exist();
      it(e.message).should.be("this is expected");
      e = error_for(nothrowsfn);
      it(e).should.not_exist();
    });
  });

  M.tests("describe some empty tests",function(M){
    M.test('this test should be blue',function(){
    });
  });

  M.tests("describe some failing tests",function(M){
    M.test("this test should fail",function(){
      this.assert(true);
      this.assert('omg! failure!',false);
      this.assert(true);
    });
    M.test("this test should fail 2",function(){
      var a = false;
      it(a).should.be(false);
      it(a).should.be(true);
    });
    M.test("failed match",function(){
      it(" foo ").should.match(/bar/);
    });
  });

  M.tests("describe some unexpected test errors",function(M){
    M.test("this test should throw an unexpected error",function(o){
      this.assertEquals('True is true, right?',true,true);
      throw new Error('whoops');
    });
  });

  M.tests('setup/teardown inheritance... check console log',function(M) {

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

});

var o = print(tests);
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
