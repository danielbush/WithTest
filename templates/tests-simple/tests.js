// Unpack unitJS modules into global namespace.

var U       = $web17_com_au$.unitJS;
var A       = $web17_com_au$.unitJS.assertions;
var Printer = $web17_com_au$.unitJS.printers.DefaultPrinter;

// Set up variables for running tests.
// 
// You can do these and the tests inside of a function (module) or
// wherever you want.

var testOrder=[];
var tests={};
var stmt;


stmt = 'foo function returns foo'
testOrder.push(stmt);
tests[stmt] = function() {
    A.assertEquals('foo',my_module.foo());
}

stmt = "foo function doesn't return 'bar"
testOrder.push(stmt);
tests[stmt] = function() {
    var a = true;
    A.assertNotEquals('bar',my_module.foo());
}

