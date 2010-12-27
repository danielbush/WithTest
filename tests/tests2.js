
var Logger    = $web17_com_au$.logger.Logger;
var P         = $web17_com_au$.pretty_print;  // Comes with logger.

var U         = $dlb_id_au$.unitJS;
var utils     = U.utils;
var print     = U.printers.print;
var print_summary = U.printers.print_summary;
var run       = U.runner.run;
var A         = U.assertions;
var E         = U.assertions.assertEquals;

// Set variables for the framework that we
// are testing.  This code is live -- it is coming
// from the files in the directories *above* us.

var $U         = $unitjs;  // See .html file where we set this very carefully!
var $utils     = $U.utils;
var $print     = $U.printers.print;
var $print_summary = $U.printers.print_summary;
var $run       = $U.runner.run;
var $A         = $U.assertions;
var $E         = $U.assertions.assertEquals;





var logger    = new Logger('unitjs logger',
                           {minimized:true,width:'700px'}).logger;
P.pp.nested = 10; // Set degree of nesting when printing objects/arrays...


var div,div_summary,results;

window.onload = function() {
    results = run(tests.unitjs);
logger.log([results]);
    div = print(results);
    div_summary = print_summary(results);
    document.body.appendChild(div_summary);
    document.body.appendChild(div);
}


var tests = {};

tests.unitjs = {};

tests.unitjs.statements = {

    section:'unitjs',

    A:{
        section:'setup/teardown',
        a01:"calls setup/teardown on every test",
        a02:"teardown is called even if there is an error",
        a03:"the result of a call to setup is passed to each test",

        a04:"setups are not run for nested sections"
        // NOTE:
        // This may change but for the moment we will keep
        // things simple.
    }

};

tests.unitjs.tests = {

    A:{

        a01:function(){
            var results;
            var tm = fixtures.setup_teardown();
            var setups=0,teardowns=0;
            tm.statements.setup = function(){setups++;};
            tm.statements.teardown = function(){teardowns++;};
            $U.runner.run(tm);
            E(2,setups);
            E(2,teardowns);
        },

        a02:function() {
            var results;
            var tm = fixtures.setup_teardown();
            var setups=0,teardowns=0;

            tm.tests.a001 = function(){throw new Error('some error');}
            tm.tests.a002 = function(){$A.assert(false);}
            tm.statements.setup = function(){setups++;};
            tm.statements.teardown = function(){teardowns++;};
            results = $U.runner.run(tm);

            E('ERROR',results.a001.stats.status);
            E('FAIL',results.a002.stats.status);
            E(2,setups);
            E(2,teardowns);
        },

        a03:function(){
            var tests = 0;
            var results;
            var tm = fixtures.setup_teardown();
            var setups=0,teardowns=0;
            tm.statements.setup = function(){return {foo:true};};
            // NOTE: we call E here, not $E because
            // we are testing `setup`.
            tm.tests.a001 = function(setup){E(true,setup.foo);tests++;};
            tm.tests.a002 = function(setup){E(true,setup.foo);tests++;};
            results = $U.runner.run(tm);
            E("Test should have been run.",2,tests);
            
        },

        a04:function(){
            var tests = 0;
            var results;
            var tm = fixtures.setup_teardown();
            var setups=0,teardowns=0;
            // Parent setup:
            tm.statements.setup = function(){return {foo:true};};
            // Nested section:
            tm.tests.A.a101 = function(setup){E(true,!setup);tests++;};
            results = $U.runner.run(tm);
            E("Test should have been run.",1,tests);
            
        }
    }
};
