
var Logger    = $web17_com_au$.logger.Logger;
var P         = $web17_com_au$.pretty_print;  // Comes with logger.
var U         = $dlb_id_au$.unitJS;

var utils     = U.utils;
var print     = U.printers.print;
var print_summary = U.printers.print_summary;
var run       = U.runner.run;
var A         = U.assertions;
var E         = U.assertions.assertEquals;
var w         = U.with_test_module;


var logger    = new Logger('unitjs logger',
                           {minimized:true,width:'700px'}).logger;
P.pp.nested = 10; // Set degree of nesting when printing objects/arrays...
logger.log('use array brackets to pretty-print: ',[{foo:'bar'}]);


var div,div_summary,results;

window.onload = function() {
  var test_module = w.with_test_module('module-1',function(M){
    M.section('section-1',function(s){
      s.test("label-1",function(t){
        t.assertEquals(1,1);
      });
    });
    M.section('section-1',function(s){
      s.test("label-1",function(t){
        t.assertEquals(1,1);
      });
    });
  });
  logger.log('test_module ',[test_module]);
  results = U.runner.run(test_module);
  logger.log('results ',[results]);
  div = print(results);
  div_summary = print_summary(results);
  document.body.appendChild(div_summary);
  document.body.appendChild(div);
}

