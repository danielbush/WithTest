// Unpack unitJS modules into global namespace.

var U        = $web17_com_au$.unitJS;
var A        = $web17_com_au$.unitJS.assertions;
var Printer  = $web17_com_au$.unitJS.printers.DefaultPrinter;
var Sections = $web17_com_au$.unitJS.Sections;
var Section  = $web17_com_au$.unitJS.Section;

// Set up variables for running tests.
// 
// You can do these and the tests inside of a function (module) or
// wherever you want.

var stmt;
var sections = new Sections();
var s1,s2,s3,s4,s5;

s1 = sections.add('Section A');

stmt = 'foo function returns foo'
s1.testOrder.push(stmt);
s1.tests[stmt] = function() {
    A.assertEquals('foo',my_module.foo());
}

stmt = "foo function doesn't return 'bar"
s1.testOrder.push(stmt);
s1.tests[stmt] = function() {
    var a = true;
    A.assertNotEquals('bar',my_module.foo());
}


s1 = sections.add('Section B - the same again');

stmt = 'foo function returns foo'
s1.testOrder.push(stmt);
s1.tests[stmt] = function() {
    A.assertEquals('foo',my_module.foo());
}

stmt = "foo function doesn't return 'bar"
s1.testOrder.push(stmt);
s1.tests[stmt] = function() {
    var a = true;
    A.assertNotEquals('bar',my_module.foo());
}

s2 = s1.subsections.add('Section B - the same again but nested');

stmt = 'foo function returns foo'
s2.testOrder.push(stmt);
s2.tests[stmt] = function() {
    A.assertEquals('foo',my_module.foo());
}

stmt = "foo function doesn't return 'bar"
s2.testOrder.push(stmt);
s2.tests[stmt] = function() {
    var a = true;
    A.assertNotEquals('bar',my_module.foo());
}
