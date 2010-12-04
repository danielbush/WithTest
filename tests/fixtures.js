var fixtures = {};
var unitjs = $dlb_id_au$.unitJS;

fixtures.test_modules = {};


fixtures.test_modules['invalid labels'] = function() {
    return {
        statements: {
            section:'section-1',
            fn:'test with invalid label'
        }
    };
}

fixtures.test_modules['nested test modules'] = function() {
    // Here we write a test module some of whose labels
    // are also test modules (not subsections).
    return {
        statements: {
            section:'outer test module',
            a001:'test-1',
            a002:{
                statements: {
                    section:'inner test module 2',
                    b001:'test-2',
                    b002: {
                        statements: {
                            section:'inner test module 3',
                            c001:'test-3'
                        },
                        tests: {
                            c001:function(){}
                        }
                    },
                    b003:'test-3'
                },
                tests: {
                    b001:function(){}
                }
            }
        },
        tests: {
            a001:function(){unitjs.assertions.assert(true);}
        }
    };
}

fixtures.test_modules['double definition'] = function() {
    return {
        statements: {
            section:'section-1',
            a001:{         // Double definition
                test:'test-1',
                fn:function(){unitjs.assertions.assert(true);}
            }
        },
        tests: {
            a001:function(){unitjs.assertions.assert(true);}
        }
    };
}

fixtures.test_modules['all status types'] = function() {
    return {
        statements: {
            section:'section-1',
            a001:'test-1',
            a002:'test-2',
            a003:'test-3',
            a004:'test-4', // No assertions
            a005:'test-5', // Not implemented
            a008:{         // Valid inline test
                test:'test-8',
                fn:function(){unitjs.assertions.assert(true);}
            }
        },
        tests: {
            a001:function(){unitjs.assertions.assert(true);},
            a002:function(){unitjs.assertions.assert(false);},
            a003:function(){throw new Error('error-1');},
            a004:function(){},
            a006:function(){} // Missing
        }
    };
}

fixtures.test_modules['nested statements'] = function() {
    return {
        statements: {
            section:'section-1',
            a001:'test-1',
            a002:{
                section:'section-2',
                b001:'test-2',
                b002:{
                    section:'section-3',
                    c001:'test-3'
                }
            }
        },
        tests: {
            a001:function(){unitjs.assertions.assert(true);},
            a002:{
                b001:function(){unitjs.assertions.assert(true);},
                b002:{
                    c001:function(){unitjs.assertions.assert(true);}
                }
            }
        }
    };
}

//------------------------------------------------------------

fixtures.test_modules['edge-case:blank statement labels'] = function() {
    return {
        statements: {
            section:'section 1',
            a003: null
        },
        tests: {
        }
    };
}

fixtures.test_modules['edge-case:null statements'] = function() {
    return {
        statements: null,
        tests: {
            a001:function(){unitjs.assertions.assert(true);},
            a002:{
                b001:function(){}
            }
        }
    };
}

fixtures.test_modules['edge-case:empty statements'] = function() {
    return {
        statements: {
            section:'empty section 1'
        }
    };
}

fixtures.test_modules['edge-case:empty statements (nested)'] = function() {
    return {
        statements: {
            section:'empty section 1',
            a001: {
                section: "nested empty section 1"
            },
            a002: {
                section: "nested empty section 2"
            }
        }
    };
}

fixtures.test_modules['edge-case:undefined statements'] = function() {
    return {
        tests: {
            a001:function(){unitjs.assertions.assert(true);},
            a002:{
                b001:function(){}
            }
        }
    };
}

fixtures.test_modules['edge-case:null tests'] = function() {
    return {
        statements: {
            section:'outer test module',
            a001:'test-1',
            a002:{
                section:'nested section 1',
                c001:'test-3'
            },
            a003:{
                statements: {
                    section:'inner test module 2',
                    b001:'test-2'
                },
                tests: null
            }
        },
        tests: null
    };
}

fixtures.test_modules['edge-case:undefined tests'] = function() {
    return {
        statements: {
            section:'outer test module',
            a001:'test-1',
            a002:{
                section:'nested section 1',
                c001:'test-3'
            },
            a003:{
                statements: {
                    section:'inner test module 2',
                    b001:'test-2'
                }
            }
        }
    };
}

fixtures.test_modules['edge-case:blank tests'] = function() {
    return {
        statements: {
            section:'outer test module',
            a001:'test-1'
        },
        tests: {
            a001:null
        }
    };
}
fixtures.test_modules['edge-case:blank tests 2'] = function() {
    return {
        statements: {
            section:'outer test module',
            a001:'test-1'
        },
        tests: { }
    };
}

fixtures.test_modules['edge-case:invalid tests 1'] = function() {
    return {
        statements: {
            section:'outer test module',
            a001:'test-1'
        },
        tests: {
            a001:'foo'
        }
    };
}

fixtures.test_modules['edge-case:invalid tests 2'] = function() {
    return {
        statements: {
            section:'outer test module',
            a002:'test-2'
        },
        tests: {
            a002:{foo:'bar'}
        }
    };
}


fixtures.test_modules["edge-case:tests > statements"] = function() {

    // Notes:
    // - tests should have subsections that statements doesn't
    // - include situations where we have nested test modules

    return {
        statements: {
            section:'outer test module',
            a003:{
                statements: {
                    section:'inner test module 2'
                },
                tests: {
                    a001:function(){},
                    a002:{
                        b001:function(){}
                    }
                }
            }
        },
        tests: {
            a001:function(){},
            a002:{
                b001:function(){}
            }
        }
    };
}

//------------------------------------------------------------

fixtures.setup_teardown = function() {
    return {
        statements: {
            section:'section-1',
            setup:function(){},
            teardown:function(){},
            a001:'test-1',
            a002:'test-2'
        },
        tests: {
            a001:function(){},
            a002:function(){}
        }
    };
}


//------------------------------------------------------------

fixtures.results = {};
fixtures.results['all possible status/outcomes'] = function() {
    return {
        section:'section-1',
        a001: {
            test:'a001',
            stats: {
                status: 'PASS',
                assertions: 1
            }
        },
        a002: {
            test:'a002',
            stats: {
                status: 'FAIL',
                assertions: 2,
                unitjs:'unitjs-1',
                message:'message-1',
                comment:'comment-1',
                stack:'stack-1'
            }
        },
        a003: {
            test:'a003',
            stats: {
                status: 'ERROR',
                assertions: 1,
                unitjs:'unitjs-1',
                message:'message-1',
                comment:'comment-1',
                stack:'stack-1'
            }
        },
        a004: {
            test:'a004',
            stats: {
                status: 'NO ASSERTIONS',
                assertions: 1,
                unitjs:'unitjs-1',
                message:'message-1',
                comment:'comment-1',
                stack:'stack-1'
            }
        },
        a005: {
            test:'a005',
            stats: {
                status: 'NOT IMPLEMENTED',
                assertions: 1,
                unitjs:'unitjs-1',
                message:'message-1',
                comment:'comment-1',
                stack:'stack-1'
            }
        },
        a006: {
            test:'a006',
            stats: {
                status: 'MISSING STATEMENT',
                assertions: 1,
                unitjs:'unitjs-1',
                message:'message-1',
                comment:'comment-1',
                stack:'stack-1'
            }
        }
    };
}

fixtures.results['nested / various outcomes']= function(){
    return {
        section:'section-1',
        a001: {
            test:'a001',
            stats: {
                status: 'PASS',
                assertions: 1
            }
        },
        a002: {
            section:'a002',
            b001: {
                test:'a002',
                stats: {
                    status: 'FAIL',
                    assertions: 2,
                    unitjs:'unitjs-1',
                    message:'message-1',
                    comment:'comment-1',
                    stack:'stack-1'
                }
            },
            b002: {
                section:'b002',
                c001: {
                    test:'a003',
                    stats: {
                        status: 'ERROR',
                        assertions: 1,
                        unitjs:'unitjs-1',
                        message:'message-1',
                        comment:'comment-1',
                        stack:'stack-1'
                    }
                }
            }
        }
    };
}

