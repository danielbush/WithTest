// Create a 2nd test module...

// Now aggregate 2nd test module with first...

tests.test_module_2 = {
    statements:{
        section:'editing and undo 2  *** this is test_module_2 ***',
        A3:{
            section:'when redoing...',
            s1:{
                section:'when the undo is not contiguous...'
            },
            s2:{
                section:'when the undo is contiguous...'
            }
        },
        A4:{
            section:'when user starts normal editing and there is undo that has not been redone...',
            s1:{
                section:'when the undo is contiguous',
                a001:'test-1'
            },
            s2:{
                section:'when the undo is not contiguous',
                a001:'test-1'
            }
        }
    },

    // Test defintions go here.
    // You can put tests in your statements above.

    tests: {
        A4:{
            s1:{
                a001:function(){}
            },
            s2:{
                a001:function(){A.assert(true);}
            }
        }
    }
}

tests.summary = {
    statements:{
        section:'Several test modules altogether',
        A:tests.test_module_1,
        B:tests.test_module_2
    },

    // Test defintions go here.
    // You can put tests in your statements above.

    tests: {}
}

