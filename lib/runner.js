/*
   This is a source file for UnitJS a unit testing framework
   for javascript.
   Copyright (C) 2009-2010 Daniel Bush
   This program is distributed under the terms of the GNU
   General Public License.  A copy of the license should be
   enclosed with this project in the file LICENSE.  If not
   see <http://www.gnu.org/licenses/>.

   Parts of this code relating to assertions were taken from the
   JSUnit project: Edward Hieatt, edward@jsunit.net Copyright (C) 2003
   All Rights Reserved.
*/ 

$dlb_id_au$.unitJS.runner = function() {

    var assertions = $dlb_id_au$.unitJS.assertions;
    var utils      = $dlb_id_au$.unitJS.utils;

    var module = {};
    var map  = utils.map;
    var omap = utils.omap;

    var errors = module.errors = {
        '001':'You used a reserved word for a test label in your test definitions.',

        '002':'You used a test with a label that is actually a section in your test statements.',
        '003':'Your tests have a subsection that is not present in your statements.',

        '004':"Invalid statement format; did you specify a section field for all sections and subsections?",

        '005':"Your statements are null or don't exist.",

        '006':"You have a label in your statement but nothing against it or it is invalid.",

        '007':"A test is invalid - should be function or hash of functions.",

        '008':"You've defined both a test and an inline test (double definition error) - you can only have one definition."
    };

    // Set to true in tests...
    module.disable_alert = false;

    var error = function(code,extra) {
        var msg = code+': '+errors[code];
        if(extra) {
            msg+=' '+extra;
        }
        if(!module.disable_alert) alert(msg);
        throw new Error(msg);
    };

    //------------------------------------------------------------
    // Run tests
    //
    // Clones `test_module.statements` before processing
    // them.

    module.run = function(test_module) {
        var results,section;
        module.validate(test_module.statements);
        test_module = module.clone(test_module);
        section = module.prepare(test_module.statements,
                                 test_module.tests);
        results = module.process(section);
        results = module.total(results);
        return results;
    }



    //------------------------------------------------------------
    // Validate test statements - make sure they are the proper
    // format.

    var validate_statement = function(obj,label) {
        if(!obj) {
            if(label) error('006','Label is '+label);
            else error('006');
        }
        if(typeof(obj)=='string') return true;      // simple statement
        if(obj.section) return true;                // nested section
        if(obj.statements) return true;             // nested test module
        if(obj.test && obj.fn &&
           typeof(obj.fn)=='function' &&
           typeof(obj.test)=='string') return true; // inline test
        if(label) error('004','Label is '+label);
        else error('004');
    }

    // Recurse on sections and process their statements (labels and values).

    module.validate = function(statements) {
        if(!statements) error('005');
        if(!statements.section ||
           typeof(statements.section)!='string') error('004');
        omap(statements,function(label,val) {
            if(!utils.reserved(label)) {
                // Avoid setup/teardown.
                validate_statement(val,label);
                if(val.statements) {
                    module.validate(val.statements);
                }
                else if(val.section) {
                    module.validate(val);
                }
            }
            else {
                switch(label) {
                case 'setup':
                case 'teardown':
                case 'section':
                case 'statements':
                    break;
                default:
                    error('001','Label is '+label);
                }
            }
        });
    }


    //------------------------------------------------------------
    // Clone
    //
    // Run after validation.

    module.clone = function(thing,obj) {
        if(!obj) obj = {};
        omap(thing,function(label,val){
            if(label=='statements' || label=='tests' ||
               val.section || val.statements || val.tests)
            {
                obj[label] = module.clone(val,{});
            } else {
                obj[label] = val;
            }
        });
        return obj;
    }

    // Prepare the statements in a test module by making all tests
    // inline with their statements.
    //
    // Notes:
    // - outer call to 1st omap recursively prepares *nested* test
    //   modules; it will call the 2nd omap on *nested* test modules;
    //   it does not prepare the outer test module
    // - outer call to 2nd omap will prepare the *outer*
    //   test module; when it recurses it continues to operate
    //   on tests in the *outer* test module
    //    


    module.prepare = function(statements,tests) {

        omap(statements,function(label,val) {
            if(val.statements) {
                statements[label] = val.statements;
                module.prepare(val.statements,val.tests);
            }
        });

        omap(tests,function(label,val) {
            if(label=='setup'||label=='teardown') {
                // Put setup and teardown in statements...
                statements[label] = val;
            } else if(!val) {
                // Don't do anything; there is no test associated
                // with the test label and that's ok - will
                // become NOT IMPLEMENTED.
            } else if(typeof(val)=='function') {
                if(statements[label]) {
                    if(statements[label].section)
                        error('002','Label is: '+label);
                    if(statements[label].test && statements[label].fn) {
                        error('008','Label is: '+label);
                    }
                    // Turn test statement into inline test definition...
                    if(typeof(statements[label])=='string') {
                        statements[label] = {
                            test:statements[label],
                            fn:val
                        };
                    }
                } else {
                    statements[label] = {
                        test:'***Unused test implementation / missing test statement!',
                        fn:val,
                        unused:true
                    };
                }
            } else if(typeof(val)=='object') {
                // Explicitly test for an object.  If val is a string,
                // for instance, we get infinite recursion.
                if(!statements[label]) {
                    error('003','Label is '+label);
                }
                module.prepare(statements[label],tests[label]);
            }
            else {
                error('007','Label is '+label);
            }
        });
        return statements;
    };


    // Recursively process a section and its subsections
    // by running their tests.
    //
    // - You don't need to pass a value for `results` - this
    //   is used in recursive calls.
    // - `section` is assumed to be the result of `module.prepare`
    //   - tests should be inlined

    module.process = function(section,results) {
        if(!results) results = {};
        results.section = section.section;
        omap(section,function(label,val) {
            if(!utils.reserved(label)) {
                if(val.fn && val.test) {
                    results[label] =
                        {test:val.test,
                         stats:assertions.run(val.fn,
                                              {setup:section.setup,
                                               teardown:section.teardown})};
                    if(val.unused) {
                        results[label].stats.status = 'MISSING STATEMENT';
                    }
                }
                else if(typeof(val)=='string') {
                    // NOT IMPLEMENTED
                    // val is statement for which there is no test
                    // definition in `tests`...
                    results[label] = {test:val,
                                      stats:assertions.run(null)};
                }
                else if(val.section) {
                    module.process(val,results[label]={});
                }
            }
        });
        return results;
    };



    // Recurse through the `results` generated by `module.process`
    // and calculate 2 things and add them to `results`:
    // - total results for each section/subsection
    // - total cumulative results for a section (including
    //   all its descendent subsections)
    (function(){

        module.total = function(results) {
            var e;
            // Extract subsections and tests from results...
            e = extract(results);
            results.stats = do_totals(e.tests);
            results.cumulative = sum_stats(make_stats(),results.stats);
            if(e.tests.length==0 && e.subsections.length==0)
                results.cumulative.empties++;
            // Cumulative stats are equal to this section's stats
            // plus its descendents...
            map(e.subsections,function(subsection) {
                var subresults = module.total(subsection);
                results.cumulative = sum_stats(
                    results.cumulative,
                    subresults.cumulative
                );
            });
            set_status(results.stats);
            set_status(results.cumulative);
            return results;
        }

        // Set the status field for `stats` and `cumulative`
        // of a section.

        var set_status = function(stats) {
            stats.status = 'OTHER';
            if(stats.pass>0) stats.status = 'PASS';
            if(stats.fail>0) stats.status = 'FAIL';
            // Errors are the most important to flag...
            if(stats.error>0) stats.status = 'ERROR';
        }

        // Create a section stats total for an array of test results.
        //
        // Each test in tests is an object resembling
        //   {test:'description',stats:{status:...,...}}
        // The stats format for a test is different to the section
        // stats we create here.

        var do_totals = function(tests) {
            var stats = make_stats();
            map(tests,function(test){
                stats.assertions += test.stats.assertions;
                stats.tests++;
                switch(test.stats.status) {
                case 'NOT IMPLEMENTED':
                    stats.not_implemented++;
                    break;
                case 'NO ASSERTIONS':
                    stats.no_assertions++;
                    break;
                case 'MISSING STATEMENT':
                    stats.missing_statements++;
                    break;
                case 'PASS': stats.pass++; break;
                case 'FAIL': stats.fail++; break;
                case 'ERROR': stats.error++; break;
                default: break;
                }
            });
            return stats;
        }

        // Extract subsections and tests from a result set.

        var extract = function(results) {
            var tests = [],subsections = [];
            omap(results,function(key,val){
                if(val.section) {
                    subsections.push(val);
                    return;
                }
                if(val.test) {
                    tests.push(val);
                    return;
                }
            });
            return {tests:tests,
                    subsections:subsections};
        }

        // Make a section stats object (summarises tests for that section).

        var make_stats = function() {
            return {assertions:0,
                    pass:0,
                    fail:0,
                    error:0,
                    tests:0,   // total tests

                    // No. of child sections (all descendents) that
                    // have no *statements* or subsections
                    empties:0,

                    // No. of *tests* that had no assertions.
                    no_assertions:0,
                    
                    // No. of *statements* that had no tests.
                    not_implemented:0,

                    // No. of tests that didn't have a corresponding
                    // statement.
                    missing_statements:0
                   };
        }

        // Add two section stats objects.
        // 
        // Usage:
        // c = sum_stats(a,b) creates new stats that is sum of a and b.
        // c = sum_stats(c,b) increments c with b
        // c = sum_stats(a) creates a clone of a.

        var sum_stats = function(a,b) {
            var stats = make_stats();
            if(!b) b = make_stats();
            omap(stats,function(key,value){
                stats[key] = a[key]+b[key];
            });
            return stats;
        }

    })();

    return module;

}();
