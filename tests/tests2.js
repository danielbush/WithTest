
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

        a04:"setups are not run for nested sections"
        // NOTE:
        // This may change but for the moment we will keep
        // things simple.
    },

    B:{
        section:'helper modules',
        b01:"tests are called and passed the helper module",
        b02:"nested sections inherit helper module from parent if one is not set",
        // RATIONALE:
        // This seems to be a reasonable default.  For each test
        // module (regardless of how many nested sections), we
        // have one helper module.


        b03:"nested test modules do NOT inherit helper modules"
        // RATIONALE:
        // We might write a test module and assign it a helper module.
        // Later we might want to aggregate this and several other
        // modules into a super test module.  The simplest thing
        // to do in this situation is to ensure that all such
        // test modules behave as they would were they called
        // in isolation.  That includes not having a test module.
    },

    C:{
        section:'localised helper functions',
        c01:"labels beginning with '_' are not processed as tests",
        c02:"values stored against these labels are available via `this`"
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
    },

    B:{
        b01:function(){
            var results;
            var tests = 0;
            var t = [];
            var tm = fixtures.test_modules['nested test modules']();
            tm.tests.a001 = function(H){t.push(H);tests++;};
            tm.statements.a002.tests.b001 = function(H){t.push(H);tests++;};
            tm.statements.a002.statements.b002.tests.c001=function(H){t.push(H);tests++;}
            results = $U.runner.run(tm);
            E(true,t[0].outer)
            E(true,t[1].a002)
            E(true,t[2].b002)
            E("Test should have been run.",3,tests);
        },

        b02:function(){
            var results;
            var tests = 0;
            var tm = fixtures.test_modules['nested sections']();
            tm.tests.a002.b002.c001 = function(H){t=H;tests++;};
            results = $U.runner.run(tm);
            E(true,t.outer);
            E("Test should have been run.",1,tests);
        },

        b03:function(){
            var t = true;
            var results;
            var tests = 0;
            var tm = fixtures.test_modules['nested test modules']();
            tm.statements.a003.statements.b002.tests.c001 = function(){t=this;tests++;};

            results = $U.runner.run(tm);
            E(true,!t.sibling);
            E("Test should have been run.",1,tests);
        }
    },

    C:{

        c01:function(){
            // See c02.
        },

        c02:function(){
            var tm = fixtures.test_modules['nested sections']();
            var obtain;
            tm.tests._foo = {foo:'foo'};
            tm.tests.a001 = function() {
                obtain = this._foo;
            }
            results = $U.runner.run(tm);
            E('foo',obtain.foo);
            
        }
    }
};
