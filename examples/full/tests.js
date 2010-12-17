
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
logger.log('put content in square brackets to pretty-print... ',[{foo:'bar'}]);


var tests = {};

tests.test_module_1 = {
    statements:{
        section:'editing and undo',
        A:{
            section: 'when editing normally...',
            z001:'you can put tests here too',
            A1:{
                section:'in general...',
                a001:'a placemarker is set by the edit operation and is associated with the ins/del tag',
                a002:'the placemarker is part of the linked list but not the dom'
            },
            A2:{
                section:'when doing a block insert/delete...',
                a001:'the edit op should push ins/del tag onto master',
                a002:'level should be set to length of master'
            },
            A3:{
                section:'when doing contiguous inserts/deletes...',
                a001:'the edit op should push ins/del tag onto session master on first action',
                a002:'level should be set to length of master',
                a003:'subsequent edit ops should increment last undo (at master[level-1])',
                a004:{
                    section:'when contiguity is broken',
                    a004a:'a new ins/del tag should be pushed onto session master'
                }
            }
        },

        B:{
            section:'when undoing...',
            B1:{
                section:'when the undo is not contiguous...',
                a001:'session master level is set to index of undone item',
                a002:'undone item is converted into standard undo-tags'
            },
            B2:{
                section:'when the undo item is contiguous...',
                a001:'session master level is set to index of undone item; a partial flag is set',
                a002:'ins/del tags are converted to partial undo tags'
            }
        },

        C:{
            section:'when redoing...',
            C1:{
                section:'when the undo is not contiguous...'
            },
            C2:{
                section:'when the undo is contiguous...'
            }
        },
        D:{
            section:'when user starts normal editing and there is undo that has not been redone...',
            D1:{
                section:'when the undo is contiguous',
                a001:'test-1',
                a002:{
                    test:'inline test',
                    fn:function(){A.assert(true);}
                }
            },
            D2:{
                section:'when the undo is not contiguous',
                a001:'test-1'
            }
        }
    },

    // Test defintions go here.
    // You can put tests in your statements above.

    tests: {
        A:{
            z002:function(){}, // Test with missing statement.
            A1:{
                setup:function(){logger.red('setting up...');},
                teardown:function(){logger.red('tearing down...');},
                a001:function(){A.assert('Should fail!',false);},
                a002:function(){A.assert('Should pass!',true);}
            },
            A2:{
                a001:function(){},
                a002:function(){throw new Error('An error occurred before any assertions!')}
            }
            
        },
        D:{
            D1:{
                a001:function(){E('true should be true',true,true);}
            },
            D2:{
                a001:function(){A.assert(true);}
            }
        }
    }
}

