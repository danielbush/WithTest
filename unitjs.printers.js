
$web17_com_au$.unitJS.printers = function() {

  var module={};

  // DefaultPrinter
  //
  // Prints results of tests into an html document.
  //
  // parentNode: the parent node we should attach our results to.
  // tests_div : div that contains test results
  // test_div  : div that contains individual test result
  //
  // We should move printing and formatting out of this module.
  // -- DBush Thu Jun  4 15:26:28 EST 2009

  module.DefaultPrinter = function(parentNode) {

    var me = this;

    // Delete 'tests' div if already in DOM...
    var tests_div=document.getElementById("tests");
    if ( tests_div ) {
      parentNode.removeChild(tests_div);
    }

    // Create 'tests' div...
    tests_div=document.createElement('DIV');
    tests_div.id = "tests";
    parentNode.appendChild( tests_div );

    me.printPass = function(num,test_name,stats) {
      var test_div=document.createElement('DIV');
      var t=tag('P',num+': '+test_name+'... ');
      t.appendChild(passed());
      test_div.appendChild(t);
      tests_div.appendChild(test_div);
    }

    me.printFail  = function(num,test_name,stats,e) {
      var test_div=document.createElement('DIV');
      var t=tag('P',num+': '+test_name+'... ');
      t.appendChild(failed());
      test_div.appendChild(t);
      test_div.appendChild(tag('P',
        "Failure on assertion #"+stats.current.assertion_count+'. '+e.message));
      if ( e.comment )
        test_div.appendChild(tag('P',"Comment: "+e.comment));
      if ( e.stack ) // Firefox when throwing 'new Error(msg)':
        test_div.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));
      tests_div.appendChild(test_div);
    }

    me.printError = function(num,test_name,stats,e) {
      var test_div=document.createElement('DIV');
      var t=tag('P',num+': '+test_name+'... ');
      t.appendChild(errored());
      test_div.appendChild(t);
      test_div.appendChild(tag('P',
        "Error occurred on or after assertion #"+stats.current.assertion_count));
      test_div.appendChild(tag('P',"Error message: "+e.message));
      if ( e.stack ) // Firefox when throwing 'new Error(msg)':
        test_div.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));
      tests_div.appendChild(test_div);
    }

    me.printStats = function(stats) {
      var stats_div = document.createElement('DIV');
      tests_div.appendChild(stats_div);
      stats_div.innerHTML = 
        'Tests: '+stats.tests+'<br/>'+
        'Tests - Failed: '+stats.failed_tests+'<br/>'+
        'Tests - Errors: '+stats.errored_tests+'<br/>'+
        'Assertions: '+stats.assertions+'<br/>';
    }

    // Helper functions to create tags:

    function tag(tagType,text) {
      var p=document.createElement(tagType);
      var ptext=document.createTextNode(text);
      p.appendChild(ptext);
      return p;
    }

    function passed() {
      var span=tag('SPAN',"PASSED");
      span.style.color="green";
      span.style.fontWeight="bold";
      return span;
    }

    function failed() {
      var span=tag('SPAN',"FAILED");
      span.style.color="red";
      span.style.fontWeight="bold";
      return span;
    }

    function errored() {
      var span=tag('SPAN',"ERROR!");
      span.style.color="white";
      span.style.backgroundColor="red";
      span.style.fontWeight="bold";
      return span;
    }

  }

  return module;

}();
