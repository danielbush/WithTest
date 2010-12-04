
var Logger    = $web17_com_au$.logger.Logger;
var P         = $web17_com_au$.pretty_print;  // Comes with logger.
var U         = $dlb_id_au$.unitJS;

var utils     = U.utils;
var print     = U.printers.print;
var print_summary = U.printers.print_summary;
var run       = U.runner.run;
var A         = U.assertions;
var E         = U.assertions.assertEquals;


var logger    = new Logger('unitjs logger',
                           {minimized:true,width:'700px'}).logger;
P.pp.nested = 10; // Set degree of nesting when printing objects/arrays...
logger.log('use array brackets to pretty-print: ',[{foo:'bar'}]);


var div,div_summary,results;

window.onload = function() {
    results = run(tests.test_module_1);
    div = print(results);
    div_summary = print_summary(results);
    document.body.appendChild(div_summary);
    document.body.appendChild(div);
}


var tests = {};

tests.test_module_1 = {

    // Test statements go here.  You can arbitrarily nest sections.

    statements:{
        section:'your section name',
        a001:'a test statement'
    },

    // Test defintions go here.
    // You can put tests in your statements above.

    tests: {
        a001:function(){
            A.assert(true);
            E(true,1==1);
        }
    }
}

