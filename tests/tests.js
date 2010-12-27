

// Note!
// - The following tests are done in unitjs-v0.4.7 ie *NOT*
//   the framework itself; this is because the version
//   I'm testing here is a complete rewrite
// - this new version of unitjs (v5+) here uses namespace $dlb_id_au$;
//   v0.4.7 uses $web17_com_au$.
// - The plan is to test v5 unitjs to test itself once I've got
//   it going (here)

var Logger   = $web17_com_au$.logger.Logger;
var pp_module= $web17_com_au$.pretty_print;  // Comes with logger.
var U        = $web17_com_au$.unitJS;
var utils    = $web17_com_au$.unitJS.utils;
var Printer  = $web17_com_au$.unitJS.printers.DefaultPrinter;
var Sections = $web17_com_au$.unitJS.Sections;
var Section  = $web17_com_au$.unitJS.Section;

var A        = U.assertions;
var E        = U.assertions.assertEquals;
var logger   = new Logger('unitjs logger',{width:'400px'}).logger;
pp_module.pp.nested = 10;

//------------------------------------------------

window.onload = function(){
    printer = new Printer(document.body);
    U.runner.sections.run(sections,printer);
    printer.expand_failed();
}

//------------------------------------------------
var sections = new Sections();
var stmt;
var s,s1,s2,s3,s4,s5;
var printer;
var setupChecker = {val:null};
var teardownChecker;

//------------------------------------------------
// Disable use of alert box for when unitjs
// throws an error.

$dlb_id_au$.unitJS.runner.disable_alert = true;

//------------------------------------------------
s = sections.add('Assertion tests');

stmt = 'Test assertions';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var a = unitjs.assertions;
    var test = function(assertion) {
        var noerrors = true;
        try {
            assertion();
        } catch(e) {
            noerrors = false;
        }
        return noerrors;
    }

    // Assertions don't return anything; failing
    // assertions will throw an error...
    var s;

    E(true, test(function(){a.assert(true);}));
    E(false,test(function(){a.assert(false);}));
    E(true, test(function(){a.assertTrue(1==1);}));
    E(true, test(function(){a.assertFalse(2==1);}));

    E(true, test(function(){a.assertEquals(1,1);}));
    E(false,test(function(){a.assertEquals(1,2);}));
    E(true, test(function(){a.assertNotEquals(1,2);}));
    E(true, test(function(){a.assertRoughlyEquals(1,2,1.1);}));
    E(true, test(function(){a.assertRoughlyEquals(1,1,1);}));

    E(true, test(function(){a.assertNull(null);}));
    E(false,test(function(){a.assertNull(undefined);}));
    E(true, test(function(){a.assertNotNull(1);}));
    E(true, test(function(){a.assertUndefined(undefined);}));
    E(false,test(function(){a.assertUndefined(null);}));
    E(true, test(function(){a.assertNotUndefined(null);}));

    E(true, test(function(){a.assertNaN("foo");}));
    E(true, test(function(){a.assertNotNaN(1);}));

    E(true, test(function(){a.assertObjectEquals(
        {foo:'bar'},{foo:'bar'});}));
    E(false, test(function(){a.assertObjectEquals(
        {foo:'bar'},{foo:'baz'});}));
    E(false,test(function(){a.assertObjectEquals(
        new String('foo'),new String('foo'));}));
    E(true, test(function(){a.assertObjectEquals(
        s=new String('foo'),s);}));
    E(true, test(function(){a.assertHashEquals(
        {foo:'bar'},{foo:'bar'});}));
    E(false,test(function(){a.assertHashEquals(
        {foo:'bar'},{foo:'baz'});}));

    E(true, test(function(){a.assertContains(
        1,[2,1,3]);}));
    // This doesn't work:
    s = {foo:'bar'};
    E(true, test(function(){a.assertContains(
        s,[2,s,3]);}));

}

stmt = 'Test assertions.run';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var a = unitjs.assertions;
    var result;


    result = a.run(function(){
        a.assert(true);
        a.assert('comment-1',false);
        a.assert(true);
    });
    //logger.red([result]);
    E(2,result.assertions);
    E('Assertion #2 failed.',result.unitjs);
    E('comment-1',result.comment);
    E('Call to assert(boolean)',result.message.substring(0,23));


    result = a.run(function(){
        throw new Error('some error');
        a.assert(true);
    });
    //logger.alert([result]);
    E(0,result.assertions);
    E('Error occurred BEFORE assertion #1.',result.unitjs);
    E(false,!!result.comment);
    E('some error',result.message);

    // We could do more tests but I plan to test
    // this version of the framework in itself rather
    // than in unitjs-0.4.7.
}

//------------------------------------------------
s = sections.add('setup/teardown hooks');

stmt = "[MOVED] calls setup/teardown on every test";
s.testOrder.push(stmt);
s.tests[stmt] = function() {
}

stmt = "[MOVED] teardown is called even if there is an error";
s.testOrder.push(stmt);
s.tests[stmt] = function() {
}

//------------------------------------------------
s = sections.add('cloning');

stmt = 'clone statements with nested ';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var cloned;
    var tm  = fixtures.test_modules['nested statements']();
    var tm2 = fixtures.test_modules['nested test modules']();

    // Not testing this completely properly... but probably
    // enough.

    var s = {};
    s.statements = tm.statements;
    A.assert(s.statements===tm.statements);
    A.assert(s.statements==tm.statements);

    cloned = unitjs.runner.clone(tm);
    A.assert(cloned!=tm);
    A.assert(cloned!==tm);
    A.assert(cloned.statements!==tm.statements);
    A.assert(cloned.statements!=tm.statements);
    E(tm.statements.section,cloned.statements.section);
    E(tm.statements.a002.section,cloned.statements.a002.section);
    E(tm.statements.a002.b002.section,
      cloned.statements.a002.b002.section);

    cloned = unitjs.runner.clone(tm2);
    A.assert(cloned!=tm2);
    A.assert(cloned!==tm2);
    A.assert(cloned.statements!==tm2.statements);
    A.assert(cloned.statements!=tm2.statements);
    E(tm2.statements.section,cloned.statements.section);
    E(tm2.statements.a002.statements.section,
      cloned.statements.a002.statements.section);
    A.assert(cloned.statements.a002.statements !==
             tm2.statements.a002.statements);
    E(tm2.statements.a002.statements.b002.statements.section,
      cloned.statements.a002.statements.b002.statements.section);

}


//------------------------------------------------
s = sections.add('the validate/prepare function...');

// TODO
// - whilst writing these tests I created `validate`;
//   maybe we need to test this separately; at the moment
//   it is run manually before we run prepare
//   -- 30-Nov-2010

stmt = 'validate weeds out reserved words in statements/sections';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['invalid labels']();
    var errors = 0;
    try {
        unitjs.runner.validate(tm.statements);
    } catch(e) {
        errors++;
        E(true,/001\b/.test(e.message));
    }
    E(1,errors);
}

stmt = 'successfully handles various status types';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['all status types']();

    unitjs.runner.validate(tm.statements);
    results = unitjs.runner.prepare(tm.statements,tm.tests);

    //logger.blue([results]);
    E('section-1',results.section);
    unitjs.utils.map([1,2,3,4],function(i){
        E('test-'+i,results['a00'+i].test);
        E('function',typeof(results['a00'+i].fn));
    })
    E('test-5',results.a005);
    E('***Unused',results.a006.test.substring(0,9));
    E(true,results.a006.unused);
}

stmt = 'successfully prepares labels that are test modules into sections with inline tests';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['nested test modules']();

    unitjs.runner.validate(tm.statements);
    results = unitjs.runner.prepare(tm.statements,tm.tests);

    //logger.blue([results]);
    E('outer test module',results.section);
    E('inner test module 2',results.a002.section);
    E('inner test module 3',results.a002.b002.section);

    // This is the outer test module...
    E('test-1',results.a001.test);
    E('function',typeof(results.a001.fn));

    // Nested test modules...
    E('test-2',results.a002.b001.test);
    E('function',typeof(results.a002.b001.fn));
    E('test-3',results.a002.b002.c001.test);
    E('function',typeof(results.a002.b002.c001.fn));
}


stmt = 'handle null or empty tests (including nested test modules)';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm1 = fixtures.test_modules['edge-case:null tests']();
    var tm2 = fixtures.test_modules['edge-case:undefined tests']();

    unitjs.runner.validate(tm1.statements);
    results = unitjs.runner.prepare(tm1.statements,tm1.tests);
    //logger.blue([results]);
    E('outer test module',results.section);
    E('test-1',results.a001);
    E('nested section 1',results.a002.section);
    E('test-3',results.a002.c001);
    E('inner test module 2',results.a003.section);
    E('test-2',results.a003.b001);

    // The above shows that `results` is in a form
    // that `process` can now handle.

    //results = unitjs.runner.process(tm1.statements);

    unitjs.runner.validate(tm2.statements);
    results = unitjs.runner.prepare(tm2.statements,tm2.tests);
    //logger.blue([results]);
    E('outer test module',results.section);
    E('test-1',results.a001);
    E('nested section 1',results.a002.section);
    E('test-3',results.a002.c001);
    E('inner test module 2',results.a003.section);
    E('test-2',results.a003.b001);
}


stmt = 'handle blank tests';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['edge-case:blank tests']();

    unitjs.runner.validate(tm.statements);
    results = unitjs.runner.prepare(tm.statements,tm.tests);
    //logger.blue([results]);
    E('outer test module',results.section);
    E('test-1',results.a001);
}

stmt = 'handle blank tests 2'; // todo
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var statements,results;
    var tm = fixtures.test_modules['edge-case:blank tests 2']();

    unitjs.runner.validate(tm.statements);
    statements = unitjs.runner.prepare(tm.statements,tm.tests);
    results = unitjs.runner.run(tm);
    //logger.blue([results]);
    E('outer test module',results.section);
    E('test-1',results.a001.test);
    // In this case, because there is a blank object,
    // we get an unimplemented test
}

stmt = 'handle invalid tests (1)';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['edge-case:invalid tests 1']();
    var errors = 0;
    try {
        unitjs.runner.validate(tm.statements);
        results = unitjs.runner.prepare(tm.statements,tm.tests);
    } catch(e) {
        errors++;
        E(true,/007\b/.test(e.message));
    }
    E(1,errors);
}

stmt = 'handle invalid tests (2)';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['edge-case:invalid tests 2']();
    var errors = 0;
    try {
        unitjs.runner.validate(tm.statements);
        results = unitjs.runner.prepare(tm.statements,tm.tests);
    } catch(e) {
        errors++;
        E(true,/007\b/.test(e.message));
    }
    E(1,errors);
}

stmt = 'handle undefined statements';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['edge-case:undefined statements']();
    var errors = false;

    try {
        unitjs.runner.validate(tm.statements);
        results = unitjs.runner.prepare(tm.statements,tm.tests);
    } catch(e) {
        errors = true;
        E(true,/005\b/.test(e.message));
    }
    E(true,errors);
}

stmt = 'handle blank statements';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['edge-case:blank statement labels']();
    var errors = false;

    try {
        unitjs.runner.validate(tm.statements);
        //results = unitjs.runner.prepare(tm.statements,tm.tests);
    } catch(e) {
        errors = true;
        E(e.message,true,/006\b/.test(e.message));
    }
    E(true,errors);
}


stmt = 'handle null statements with an error';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['edge-case:null statements']();
    var errors = false;

    try {
        unitjs.runner.validate(tm.statements);
        //results = unitjs.runner.prepare(tm.statements,tm.tests);
    } catch(e) {
        errors = true;
        E(true,/005\b/.test(e.message));
    }
    E(true,errors);
}

stmt = "fail when statements don't mirror nesting of tests";
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules["edge-case:tests > statements"]();
    var errors = false;

    try {
        unitjs.runner.validate(tm.statements);
        results = unitjs.runner.prepare(tm.statements,tm.tests);
    } catch(e) {
        errors = true;
        E(e.message,true,/003\b/.test(e.message));
    }
    E(true,errors);
}

stmt = "fail when we define both a test and inline test";
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules["double definition"]();
    var errors = false;

    try {
        unitjs.runner.validate(tm.statements);
        results = unitjs.runner.prepare(tm.statements,tm.tests);
    } catch(e) {
        errors = true;
        E(e.message,true,/008\b/.test(e.message));
    }
    E(true,errors);
}



//------------------------------------------------
s = sections.add('the process function...');


stmt = 'counts passed, failed, errored, zero-assertion and unimplemented tests';
// This includes situations where tests are not implemented.
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['all status types']();
    // TODO
    // - replace call to prepare with prepared statements fixture
    results = unitjs.runner.process(
        unitjs.runner.prepare(tm.statements,tm.tests));

    //logger.log([results]);
    E('PASS',results.a001.stats.status);
    E('FAIL',results.a002.stats.status);
    E('ERROR',results.a003.stats.status);
    E('NO ASSERTIONS',results.a004.stats.status);
    E('NOT IMPLEMENTED',results.a005.stats.status);
    E('MISSING STATEMENT',results.a006.stats.status);
    E('PASS',results.a008.stats.status);
}



stmt = 'processes nested tests';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['nested statements']();
    // TODO
    // - replace call to prepare with prepared statements fixture
    results = unitjs.runner.process(
        unitjs.runner.prepare(tm.statements,tm.tests));

    //logger.blue([results]);
    E('section-1',results.section);
    E('section-2',results.a002.section);
    E('section-3',results.a002.b002.section);
    E(1,results.a002.b002.c001.stats.assertions);
    E('PASS',results.a002.b002.c001.stats.status);
}

stmt = 'processes nested test modules';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['nested test modules']();
    results = unitjs.runner.process(
        unitjs.runner.prepare(
            tm.statements,tm.tests));
    //logger.blue([results]);
    E('outer test module',results.section);
    E('inner test module 2',results.a002.section);
    E('inner test module 3',results.a002.b002.section);

    // This is the outer test module...
    E('test-1',results.a001.test);
    E('object',typeof(results.a001.stats));

    // Nested test modules...
    E('test-2',results.a002.b001.test);
    E('object',typeof(results.a002.b001.stats));
    E('test-3',results.a002.b002.c001.test);
    E('object',typeof(results.a002.b002.c001.stats));

    E('PASS',results.a001.stats.status);
    E('NO ASSERTIONS',results.a002.b002.c001.stats.status);
    E('NO ASSERTIONS',results.a002.b001.stats.status);
    E('NOT IMPLEMENTED',results.a002.b003.stats.status);

    // I'm happy that we are getting a valid test
    // results.
    // 
    // TODO
    // One thing we could do is in fixtures, store
    // both the before and after of processing a
    // data structure.  Then write a routine to
    // recursively compare them.
}


//------------------------------------------------
s = sections.add('the run function...');

stmt = 'should call both prepare and process and return results';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['all status types']();
    results = unitjs.runner.run(tm);

    //logger.log([results]);
    E('PASS',results.a001.stats.status);
    E('FAIL',results.a002.stats.status);
    E('ERROR',results.a003.stats.status);
    E('NO ASSERTIONS',results.a004.stats.status);
    E('NOT IMPLEMENTED',results.a005.stats.status);
    E('MISSING STATEMENT',results.a006.stats.status);
}

stmt = 'should run a test module with nested test modules';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['nested test modules']();
    results = unitjs.runner.run(tm);

    //logger.log([results]);
}

stmt = 'empty statements';
stmt = 'null statements';
stmt = 'not fully nested statements';
stmt = 'empty tests';
stmt = 'null tests';
stmt = 'not fully nested tests';

//------------------------------------------------
s = sections.add('the total function...');

stmt = 'correctly totals up different types of results';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results = fixtures.results['all possible status/outcomes']();
    unitjs.runner.total(results);
    //logger.log([results]);
    // Test results.stats and results.cumulative...
    unitjs.utils.map(['stats','cumulative'],function(prop){
        E(7,results[prop].assertions);
        E(6,results[prop].tests);
        E(1,results[prop].pass);
        E(1,results[prop].fail);
        E(1,results[prop].error);
        E(1,results[prop].no_assertions);
        E(1,results[prop].not_implemented);
        E(1,results[prop].missing_statements);
    });
}

stmt = 'correctly totals up nested results';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results = fixtures.results['nested / various outcomes']();
    unitjs.runner.total(results);
    //logger.yellow([results]);
    // Test cumulative of `results`...
    E(4,results.cumulative.assertions);
    E(3,results.cumulative.tests);
    E(1,results.cumulative.pass);
    E(1,results.cumulative.fail);
    E(1,results.cumulative.error);
    E(0,results.cumulative.no_assertions);
    E(0,results.cumulative.not_implemented);
    E(0,results.cumulative.missing_statements);

    // Test cumulative of `results.*`...

    var p;

    // c001 is a test (only has test stats)...
    p = results.a002.b002.c001;
    //logger.blue([p]);
    E(1,p.stats.assertions);
    
    // b002 is a (sub)section...
    p = results.a002.b002;
    E(1,p.stats.assertions);
    E(1,p.stats.tests);
    E(1,p.cumulative.assertions);
    E(1,p.cumulative.tests);
}

stmt = 'count empty sections (sections with no statements)';
s.testOrder.push(stmt);
s.tests[stmt] = function() {
    var unitjs = $dlb_id_au$.unitJS;
    var results;
    var tm = fixtures.test_modules['edge-case:empty statements']();
    var tm2 =
        fixtures.test_modules['edge-case:empty statements (nested)']();

    results = unitjs.runner.run(tm);
    E(1,results.cumulative.empties);

    results = unitjs.runner.run(tm2);
    E('empty section 1',results.section);
    E(2,results.cumulative.empties);
}
