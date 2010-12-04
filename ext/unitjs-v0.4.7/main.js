/*

   This is a source file for UnitJS a unit testing framework
   for javascript.
   Copyright (C) 2009-2010 Daniel Bush
   This program is distributed under the terms of the GNU
   General Public License.  A copy of the license should be
   enclosed with this project in the file LICENSE.  If not
   see <http://www.gnu.org/licenses/>.
  
   Substantial parts of this code were taken from the JSUnit
   project.  The Initial Developer of the Original Code is
   Edward Hieatt, edward@jsunit.net.  Portions created by
   the Initial Developer are Copyright (C) 2003 the Initial
   Developer.  All Rights Reserved.
  
*/

var $web17_com_au$=$web17_com_au$||{};$web17_com_au$.unitJS_module=function(){var module={};module.spawn=function(){return $web17_com_au$.unitJS_module();}
var _UNDEFINED_VALUE;var STATS=null;module.Stats=function(){var me=this;me.tests=0;me.failed_tests=0;me.errored_tests=0;me.assertions=0;me.untested=[];me.section={};me.section.name=null;me.section.tests=0;me.section.failed_tests=0;me.section.errored_tests=0;me.section.assertions=0;me.section.untested=[];me.section.reset=function(){me.section.name=null;me.section.tests=0;me.section.failed_tests=0;me.section.errored_tests=0;me.section.assertions=0;}
me.current={};me.current.test_name=null;me.current.assertion_count=0;me.current.assertion_level=0;me.current.reset=function(){me.current.test_name=null;me.current.assertion_count=0;me.current.assertion_level=0;}
me.merge=function(stats){me.tests+=stats.tests;me.failed_tests+=stats.failed_tests;me.errored_tests+=stats.errored_tests;me.assertions+=stats.assertions;for(var j=0;j<stats.untested.length;j++)
me.untested.push(stats.untested[j]);me.section.tests+=stats.section.tests;me.section.failed_tests+=stats.section.failed_tests;me.section.errored_tests+=stats.section.errored_tests;me.section.assertions+=stats.section.assertions;for(var j=0;j<stats.section.untested.length;j++)
me.section.untested.push(stats.section.untested[j]);}}
module.runner=function(){var runner={};runner.setup=null;runner.teardown=null;runner.local={};runner.only=[];runner.onlyFound=false;runner.run=function(testOrder,tests,printer,nested,options){var stats=new module.Stats();var test_name,full_test_name,test_func,to_check={};var i,j,n;var onlyFound;runner.onlyFound=false;if(!nested)printer.reset();for(i=0;i<testOrder.length;i++){test_name=testOrder[i];full_test_name=test_name;if(options&&options.stmts){full_test_name=test_name+': '+options.stmts[test_name];}
onlyFound=false;if(runner.only&&runner.only.length>0){for(j=0;j<runner.only.length;j++){if(runner.only[j]==tests[test_name]){onlyFound=true;runner.onlyFound=true;}}
if(!onlyFound){continue;}}
if(tests[test_name]){to_check[test_name]=true;try{stats.tests++;stats.section.tests++;stats.current.reset();stats.current.test_name=test_name;STATS=stats;if(runner.setup)runner.setup();if(options&&options.setup)options.setup();test_func=tests[test_name];test_func(stats);printer.printPass(i+1,full_test_name,stats,test_func.pending);}
catch(e){if(e.isFailure){stats.failed_tests++;stats.section.failed_tests++;printer.printFail(i+1,full_test_name,stats,e,test_func.pending);}
else{stats.errored_tests++;stats.section.errored_tests++;printer.printError(i+1,full_test_name,stats,e,test_func.pending);}
stats.current.reset();}
if(runner.local.teardown){runner.local.teardown();runner.local.teardown=null;}
if(options&&options.teardown)options.teardown();if(runner.teardown)runner.teardown();}
STATS=null;}
stats.untested=[];stats.section.untested=[];for(var n in tests){if(!to_check[n]){stats.untested.push(n);stats.section.untested.push(n);printer.printError(++i,'[MISSING]: '+n,stats,{message:"Test is defined but not run - did you forget to include it in your statements?"},false);}}
if(!nested){printer.printStats(stats);printer.finish();}
return stats;}
runner.sections={};runner.sections.run=function(sections,printer,level){var i,n,p,j;var section,section_printer,calc_stats,all_stats,nested;var section_only_mode=(sections.only.length>0),is_only=false;if(!level){printer.start();all_stats=new module.Stats();level=1;printer.reset();}
for(i=0;i<sections.members.length;i++){section=sections.members[i];is_only=false;section_printer=printer.section_printer(section.name);if(section_only_mode){for(j=0;j<sections.only.length;j++){if(sections.only[j]==section){is_only=true;break;}}}
if(!section_only_mode||(section_only_mode&&is_only))
section.stats=runner.run(section.testOrder,section.tests,section_printer,true,{setup:section.setup,teardown:section.teardown,stmts:section.stmts});else section.stats=new module.Stats();for(n in section.tests){if(section.tests[n].pending){section.pending=true
break;}}
if(section.pending==true&&!section._pending){section._pending=true;for(p=section.parent;p;p=p.parent){if(p._pending)break;p.pending=true;p._pending=true;}}
if(section.subsections.members.length>0){section.subsections.only=sections.only;runner.sections.run(section.subsections,section_printer,level+1);}
calc_stats=section.calculateStats();section_printer.updateSectionStatus(calc_stats,section.pending);if(level==1){all_stats.merge(calc_stats);}}
if(level==1){printer.printStats(all_stats);printer.finish();return all_stats;}}
return runner;}();module.Sections=function(parentSection){var me=this;me.members=[];me.only=[];me.add=function(obj){var s,i;if(obj instanceof module.Section){me.members.push(obj);if(parentSection)obj.parent=parentSection;}
else if(obj instanceof module.Sections){for(i=0;i<obj.members.length;i++){me.members.push(obj.members[i]);if(parentSection)obj.members[i].parent=parentSection;}}
else{s=new module.Section(obj);me.members.push(s);if(parentSection)s.parent=parentSection;return s;}}}
module.Section=function(name){var me=this;me.name=name;me.subsections=new module.Sections(me);me.testOrder=[];me.tests={};me.stmts=null;me.stats=null;me.calculateStats=function(){var stats=new module.Stats();stats.merge(me.stats);for(var i=0;i<me.subsections.members.length;i++){stats.merge(me.subsections.members[i].calculateStats());}
return stats;}
me.set_stmts=function(stmts){var n;me.stmts=stmts;for(n in stmts)me.testOrder.push(n);return me;}}
module.assertions=function(){var assertions={};function before_assert(){STATS.current.assertion_level++;if(STATS.current.assertion_level==1){STATS.current.assertion_count++;STATS.assertions++;STATS.section.assertions++;}}
function after_assert(){STATS.current.assertion_level--;}
function _assert(comment,booleanValue,assertionTypeMessage){if(!booleanValue){module.utils.fail(comment,assertionTypeMessage);}}
assertions.assert=function(){module.utils._validateArguments(1,arguments);var booleanValue=module.utils.nonCommentArg(1,1,arguments);if(typeof(booleanValue)!='boolean')
module.utils.error('Bad argument to assert(boolean)');_assert(module.utils.commentArg(1,arguments),booleanValue===true,'Call to assert(boolean) with false');}
assertions.assertTrue=function(){module.utils._validateArguments(1,arguments);var booleanValue=module.utils.nonCommentArg(1,1,arguments);if(typeof(booleanValue)!='boolean')
module.utils.error('Bad argument to assertTrue(boolean)');_assert(module.utils.commentArg(1,arguments),booleanValue===true,'Call to assertTrue(boolean) with false');}
assertions.assertFalse=function(){module.utils._validateArguments(1,arguments);var booleanValue=module.utils.nonCommentArg(1,1,arguments);if(typeof(booleanValue)!='boolean')
module.utils.error('Bad argument to assertFalse(boolean)');_assert(module.utils.commentArg(1,arguments),booleanValue===false,'Call to assertFalse(boolean) with true');}
assertions.assertEquals=function(){module.utils._validateArguments(2,arguments);var var1=module.utils.nonCommentArg(1,2,arguments);var var2=module.utils.nonCommentArg(2,2,arguments);_assert(module.utils.commentArg(2,arguments),var1===var2,'Expected '+
module.utils._displayStringForValue(var1)+' but was '+
module.utils._displayStringForValue(var2));}
assertions.assertNotEquals=function(){module.utils._validateArguments(2,arguments);var var1=module.utils.nonCommentArg(1,2,arguments);var var2=module.utils.nonCommentArg(2,2,arguments);_assert(module.utils.commentArg(2,arguments),var1!==var2,'Expected not to be '+
module.utils._displayStringForValue(var2));}
assertions.assertNull=function(){module.utils._validateArguments(1,arguments);var aVar=module.utils.nonCommentArg(1,1,arguments);_assert(module.utils.commentArg(1,arguments),aVar===null,'Expected '+
module.utils._displayStringForValue(null)+' but was '+
module.utils._displayStringForValue(aVar));}
assertions.assertNotNull=function(){module.utils._validateArguments(1,arguments);var aVar=module.utils.nonCommentArg(1,1,arguments);_assert(module.utils.commentArg(1,arguments),aVar!==null,'Expected not to be '+
module.utils._displayStringForValue(null));}
assertions.assertUndefined=function(){module.utils._validateArguments(1,arguments);var aVar=module.utils.nonCommentArg(1,1,arguments);_assert(module.utils.commentArg(1,arguments),aVar===_UNDEFINED_VALUE,'Expected '+
module.utils._displayStringForValue(_UNDEFINED_VALUE)+' but was '+
module.utils._displayStringForValue(aVar));}
assertions.assertNotUndefined=function(){module.utils._validateArguments(1,arguments);var aVar=module.utils.nonCommentArg(1,1,arguments);_assert(module.utils.commentArg(1,arguments),aVar!==_UNDEFINED_VALUE,'Expected not to be '+
module.utils._displayStringForValue(_UNDEFINED_VALUE));}
assertions.assertNaN=function(){module.utils._validateArguments(1,arguments);var aVar=module.utils.nonCommentArg(1,1,arguments);_assert(module.utils.commentArg(1,arguments),isNaN(aVar),'Expected NaN');}
assertions.assertNotNaN=function(){module.utils._validateArguments(1,arguments);var aVar=module.utils.nonCommentArg(1,1,arguments);_assert(module.utils.commentArg(1,arguments),!isNaN(aVar),'Expected not NaN');}
assertions.assertObjectEquals=function(){module.utils._validateArguments(2,arguments);var var1=module.utils.nonCommentArg(1,2,arguments);var var2=module.utils.nonCommentArg(2,2,arguments);var type1=module.utils._trueTypeOf(var1);var type2=module.utils._trueTypeOf(var2);var msg=module.utils.commentArg(2,arguments)?module.utils.commentArg(2,arguments):'';var isSame=(var1===var2);var sameType=(type1==type2);var isEqual=isSame||sameType;if(!isSame){switch(type1){case'String':if(type2!='String'){isEqual=false;break;}
isEqual=(var1==var2);break;case'Number':if(type2!='Number'){isEqual=false;break;}
isEqual=(var1==var2);break;case'Boolean':case'Date':isEqual=(var1===var2);break;case'RegExp':case'Function':isEqual=(var1.toString()===var2.toString());break;default:var i;if(isEqual=(var1.length===var2.length))
for(i in var1)
assertions.assertObjectEquals(msg+' found nested '+
type1+'@'+i+'\n',var1[i],var2[i]);}
_assert(msg,isEqual,'Expected '+module.utils._displayStringForValue(var1)+' but was '+module.utils._displayStringForValue(var2));}}
assertions.assertArrayEquals=assertions.assertObjectEquals;assertions.assertEvaluatesToTrue=function(){module.utils._validateArguments(1,arguments);var value=module.utils.nonCommentArg(1,1,arguments);if(!value)
module.utils.fail('',module.utils.commentArg(1,arguments));}
assertions.assertEvaluatesToFalse=function(){module.utils._validateArguments(1,arguments);var value=module.utils.nonCommentArg(1,1,arguments);if(value)
module.utils.fail('',module.utils.commentArg(1,arguments));}
assertions.assertHTMLEquals=function(){module.utils._validateArguments(2,arguments);var var1=module.utils.nonCommentArg(1,2,arguments);var var2=module.utils.nonCommentArg(2,2,arguments);var var1Standardized=module.utils.standardizeHTML(var1);var var2Standardized=module.utils.standardizeHTML(var2);_assert(module.utils.commentArg(2,arguments),var1Standardized===var2Standardized,'Expected '+
module.utils._displayStringForValue(var1Standardized)+' but was '+
module.utils._displayStringForValue(var2Standardized));}
assertions.assertHashEquals=function(){module.utils._validateArguments(2,arguments);var var1=module.utils.nonCommentArg(1,2,arguments);var var2=module.utils.nonCommentArg(2,2,arguments);for(var key in var1){assertions.assertNotUndefined("Expected hash had key "+key+" that was not found",var2[key]);assertions.assertEquals("Value for key "+key+" mismatch - expected = "+var1[key]+", actual = "+var2[key],var1[key],var2[key]);}
for(var key in var2){assertions.assertNotUndefined("Actual hash had key "+key+" that was not expected",var1[key]);}}
assertions.assertRoughlyEquals=function(){module.utils._validateArguments(3,arguments);var expected=module.utils.nonCommentArg(1,3,arguments);var actual=module.utils.nonCommentArg(2,3,arguments);var tolerance=module.utils.nonCommentArg(3,3,arguments);assertions.assertTrue("Expected "+expected+", but got "+actual+" which was more than "+tolerance+" away",Math.abs(expected-actual)<tolerance);}
assertions.assertContains=function(){module.utils._validateArguments(2,arguments);var contained=module.utils.nonCommentArg(1,2,arguments);var container=module.utils.nonCommentArg(2,2,arguments);assertions.assertTrue("Expected '"+container+"' to contain '"+contained+"'",container.indexOf(contained)!=-1);}
assertions.assertFailure=function(comment,errorObject){assertions.assertNotNull(comment,errorObject);assertions.assert(comment,errorObject.isFailure);assertions.assertNotUndefined(comment,errorObject.comment);}
assertions.assertError=function(comment,errorObject){assertions.assertNotNull(comment,errorObject);assertions.assertUndefined(comment,errorObject.isFailure);assertions.assertNotUndefined(comment,errorObject.description);}
for(var i in assertions){var assertion;if(/^assert/.test(i)){assertion=assertions[i];assertions[i]=function(assertion2){return function(){before_assert();assertion2.apply(this,arguments);after_assert();};}(assertion);}}
return assertions;}();module.utils=function(){var utils={};utils.push=function(anArray,anObject){anArray[anArray.length]=anObject;}
utils.pop=function(anArray){if(anArray.length>=1){delete anArray[anArray.length-1];anArray.length--;}}
utils.isBlank=function(str){return utils.trim(str)=='';}
utils.trim=function(str){if(str==null)return null;var startingIndex=0;var endingIndex=str.length-1;while(str.substring(startingIndex,startingIndex+1)==' ')
startingIndex++;while(str.substring(endingIndex,endingIndex+1)==' ')
endingIndex--;if(endingIndex<startingIndex)return'';return str.substring(startingIndex,endingIndex+1);}
utils.getFunctionName=function(aFunction){var regexpResult=aFunction.toString().match(/function(\s*)(\w*)/);if(regexpResult&&regexpResult.length>=2&&regexpResult[2]){return regexpResult[2];}
return'anonymous';}
utils.getStackTrace=function(){var result='';if(typeof(arguments.caller)!='undefined'){for(var a=arguments.caller;a!=null;a=a.caller){result+='> '+utils.getFunctionName(a.callee)+'\n';if(a.caller==a){result+='*';break;}}}
else{var testExcp;try{foo.bar;}
catch(testExcp){var stack=utils.parseErrorStack(testExcp);for(var i=1;i<stack.length;i++){result+='> '+stack[i]+'\n';}}}
return result;}
utils.parseErrorStack=function(excp){var stack=[];var name;if(!excp||!excp.stack){return stack;}
var stacklist=excp.stack.split('\n');for(var i=0;i<stacklist.length-1;i++){var framedata=stacklist[i];name=framedata.match(/^(\w*)/)[1];if(!name)name='anonymous';stack[stack.length]=name;}
while(stack.length&&stack[stack.length-1]=='anonymous'){stack.length=stack.length-1;}
return stack;}
utils._trueTypeOf=function(something){var result=typeof something;try{switch(result){case'string':case'boolean':case'number':break;case'object':case'function':switch(something.constructor)
{case String:result='String';break;case Boolean:result='Boolean';break;case Number:result='Number';break;case Array:result='Array';break;case RegExp:result='RegExp';break;case Function:result='Function';break;default:var m=something.constructor.toString().match(/function\s*([^( ]+)\(/);if(m)
result=m[1];else
break;}
break;}}
finally{result=result.substr(0,1).toUpperCase()+result.substr(1);return result;}}
utils._displayStringForValue=function(aVar){var result='<'+aVar+'>';if(!(aVar===null||aVar===_UNDEFINED_VALUE)){result+=' ('+utils._trueTypeOf(aVar)+')';}
return result;}
utils.fail=function(comment,assertionTypeMessage){var e=new Error(assertionTypeMessage);e.isFailure=true;e.comment=comment;throw e;}
utils.error=function(errorMessage){var e=new Error(errorMessage);e.description=errorMessage;throw e;}
utils.argumentsIncludeComments=function(expectedNumberOfNonCommentArgs,args){return args.length==expectedNumberOfNonCommentArgs+1;}
utils.commentArg=function(expectedNumberOfNonCommentArgs,args){if(utils.argumentsIncludeComments(expectedNumberOfNonCommentArgs,args))
return args[0];return null;}
utils.nonCommentArg=function(desiredNonCommentArgIndex,expectedNumberOfNonCommentArgs,args){return utils.argumentsIncludeComments(expectedNumberOfNonCommentArgs,args)?args[desiredNonCommentArgIndex]:args[desiredNonCommentArgIndex-1];}
utils._validateArguments=function(expectedNumberOfNonCommentArgs,args){if(!(args.length==expectedNumberOfNonCommentArgs||(args.length==expectedNumberOfNonCommentArgs+1&&typeof(args[0])=='string')))
utils.error('Incorrect arguments passed to assert function');}
utils.standardizeHTML=function(html){var translator=document.createElement("DIV");translator.innerHTML=html;return translator.innerHTML;}
return utils;}();return module;}
$web17_com_au$.unitJS=$web17_com_au$.unitJS_module();$web17_com_au$.unitJS.printers=function(){var module={};module.DummyPrinter=function(parentNode,label){var me=this;me.start=function(){}
me.finish=function(){}
me.printPass=function(num,test_name,stats){}
me.printFail=function(num,test_name,stats){}
me.printError=function(num,test_name,stats){}
me.printStats=function(stats){}
me.section_printer=function(section_name){return me;}
me.updateSectionStatus=function(stats){}
me.reset=function(){}}
module.DefaultPrinter=function(parentNode,label,nested){var me=this;var tests_frame_div;var banner_div;var menu_div;var title_div;var h2_div;var tests_div;var stats_container_div;var finished=false;me.start=function(){finished=false;}
me.finish=function(){finished=true;}
me.reset=function(){var tmp=document.getElementById("tests");if(tmp){tmp.parentNode.removeChild(tmp);}
build();}
function build(){tests_frame_div=document.createElement('DIV');tests_div=document.createElement('DIV');tests_div.passed=true;stats_container_div=document.createElement('DIV');tests_frame_div.innerHTML='<div class="banner" ><div class="menu" ></div>'+'<div class="title" ><h2></h2></div><div class="clear"></div></div>';banner_div=tests_frame_div.firstChild;menu_div=banner_div.firstChild;title_div=banner_div.firstChild.nextSibling;h2_div=title_div.firstChild;if(!nested){tests_frame_div.id="tests";parentNode.appendChild(tests_frame_div);}else{tests_frame_div.className='section';parentNode.appendChild(tests_frame_div);tests_div.style.display='none';}
if(label){h2_div.innerHTML=label;}
title_div.onclick=function(){var hidden_tests=tests_div.hidden_tests;show_tests(tests_div);if(hidden_tests){tests_div.style.display='';}else{tests_div.style.display=='none'?tests_div.style.display='':tests_div.style.display='none';}};stats_container_div.className="stats-container";tests_frame_div.appendChild(stats_container_div);tests_frame_div.appendChild(tests_div);}
if(nested)build();if(!nested)me.reset();me.updateSectionStatus=function(stats,pending){var msg=' (Tests:'+stats.section.tests+'; ';if(stats.section.failed_tests>0||stats.section.errored_tests>0){msg+=' Fails: '+stats.section.failed_tests+' / Errors: '+stats.section.errored_tests+')';banner_div.className="banner section-fail";if(pending){msg+=' [Pending]';banner_div.className+=" section-pending";}
h2_div.appendChild(document.createTextNode(msg));}
else if(stats.tests==0){msg+=' No tests)'
banner_div.className="banner section-empty";if(pending){msg+=' [Pending]';banner_div.className+=" section-pending";}
h2_div.appendChild(document.createTextNode(msg));}
else if(stats.assertions==0){msg+=' No assertions)'
banner_div.className="banner section-empty";if(pending){msg+=' [Pending]';banner_div.className+=" section-pending";}
h2_div.appendChild(document.createTextNode(msg));}
else{msg+=' Passed)'
banner_div.className="banner section-pass";if(pending){msg+=' [Pending]';banner_div.className+=" section-pending";}
h2_div.appendChild(document.createTextNode(msg));}
if(pending)tests_div.pending=true;}
var section_printers=[];me.section_printer=function(name){var printer=new module.DefaultPrinter(tests_div,name,true);section_printers.push(printer);return printer;}
me.printPass=function(num,test_name,stats,pending){var test_div=document.createElement('DIV');var t=tag('SPAN',num+': '+test_name+'... ');test_div.passed=true;if(pending)test_div.pending=true;test_div.appendChild(t);if(stats.current.assertion_count==0){test_div.className='test test-empty';test_div.appendChild(empty(pending));}else{test_div.className='test test-pass';test_div.appendChild(passed(pending));}
test_div.appendChild(clearing_div());tests_div.appendChild(test_div);}
me.printFail=function(num,test_name,stats,e,pending){var test_div=document.createElement('DIV');var t=tag('SPAN',num+': '+test_name+'... ');test_div.passed=false;if(pending)test_div.pending=true;test_div.className='test test-fail';test_div.appendChild(t);test_div.appendChild(failed(pending));test_div.appendChild(clearing_div());test_div.appendChild(tag('P',"Failure on assertion #"+stats.current.assertion_count+'. '+e.message));if(e.comment)
test_div.appendChild(tag('P',"Comment: "+e.comment));if(e.stack)
test_div.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));tests_div.appendChild(test_div);tests_div.passed=false;}
me.printError=function(num,test_name,stats,e,pending){var test_div=document.createElement('DIV');var t=tag('P',num+': '+test_name+'... ');test_div.error=true;if(pending)test_div.pending=true;test_div.className='test test-error';test_div.appendChild(t);test_div.appendChild(errored(pending));test_div.appendChild(clearing_div());if(stats.current.assertion_count==0){test_div.appendChild(tag('P',"Error occurred before first assertion."));}else{test_div.appendChild(tag('P',"Error occurred on or after assertion #"+stats.current.assertion_count));}
test_div.appendChild(tag('P',"Error message: "+e.message));if(e.stack)
test_div.appendChild(tag('PRE',"Firefox Stack trace: "+e.stack));tests_div.appendChild(test_div);tests_div.error=true;}
me.printStats=function(stats){var holder_div=document.createElement('DIV');var stats_div=document.createElement('DIV');holder_div.className='stats-holder';stats_div.style.display='';stats_div.className='stats';stats_div.innerHTML='<h2>Summary</h2>'+'Tests: '+stats.tests+'<br/>'+'Tests - Failed: '+stats.failed_tests+'<br/>'+'Tests - Errors: '+stats.errored_tests+'<br/>'+'Assertions: '+stats.assertions+'<br/>';if(stats.untested.length>0){stats_div.innerHTML+='Missing: '+stats.untested.length+'<br/>';}
holder_div.appendChild(stats_div);stats_container_div.appendChild(holder_div);}
var modifiable=function(){if(!nested){if(!finished){alert('You need to run some tests!');return false;}}
return true;}
me.collapse=function(only_reset){if(!modifiable())return;var i;if(nested){if(!only_reset)tests_div.style.display='none';show_tests(tests_div);}
for(i=0;i<section_printers.length;i++){section_printers[i].collapse(only_reset);}}
me.expand=function(){if(!modifiable())return;var i;if(nested){tests_div.style.display='';show_tests(tests_div);}
for(i=0;i<section_printers.length;i++){section_printers[i].expand();}}
var hide_tests=function(tests_div){var j;for(j=0;j<tests_div.childNodes.length;j++){if(tests_div.childNodes.item(j).className.indexOf('test ')==0){tests_div.childNodes.item(j).style.display='none';}}
tests_div.hidden_tests=true;}
var show_tests=function(tests_div){var j;for(j=0;j<tests_div.childNodes.length;j++){if(tests_div.childNodes.item(j).className.indexOf('test ')==0){tests_div.childNodes.item(j).style.display='';}}
tests_div.hidden_tests=false;}
var show_failed=function(tests_div){var j,test_div;var failed=false;for(j=0;j<tests_div.childNodes.length;j++){test_div=tests_div.childNodes.item(j);if(test_div.className.indexOf('test ')==0){if(test_div.error===true||test_div.passed===false){test_div.style.display='';failed=true;}else{test_div.style.display='none';tests_div.hidden_tests=true;}}}
return failed;}
var show_pending=function(tests_div){var j,test_div;var pending=false;for(j=0;j<tests_div.childNodes.length;j++){test_div=tests_div.childNodes.item(j);if(test_div.className.indexOf('test ')==0){if(test_div.pending===true){test_div.style.display='';pending=true;}else{test_div.style.display='none';tests_div.hidden_tests=true;}}}
return pending;}
me.expand_sections=function(){if(!modifiable())return;var i,j;if(nested){tests_div.style.display='';hide_tests(tests_div);}
for(i=0;i<section_printers.length;i++){section_printers[i].expand_sections();}}
me.expand_failed=function(){if(!modifiable())return;var i,j,failed=false,failed_children=false;for(i=0;i<section_printers.length;i++){failed_children=section_printers[i].expand_failed()||failed_children;}
if(nested){failed=show_failed(tests_div);if(failed||failed_children)tests_div.style.display='';else tests_div.style.display='none';}
return(failed||failed_children);}
me.expand_pending=function(){if(!modifiable())return;var i,j,pending=false,pending_children=false;for(i=0;i<section_printers.length;i++){pending_children=section_printers[i].expand_pending()||pending_children;}
if(nested){pending=(show_pending(tests_div)||tests_div.pending);if(pending||pending_children)tests_div.style.display='';else tests_div.style.display='none';}
return(pending||pending_children);}
function clearing_div(){var d=document.createElement('DIV');d.className="clear";return d;}
function tag(tagType,text){var p=document.createElement(tagType);var ptext=document.createTextNode(text);p.appendChild(ptext);return p;}
function passed(pending){var span;if(pending)span=tag('SPAN',"PASSED [PENDING]");else span=tag('SPAN',"PASSED");span.className="pass";if(pending)span.className+=' pending';return span;}
function failed(pending){var span;if(pending)span=tag('SPAN',"FAILED [PENDING]");else span=tag('SPAN',"FAILED");span.className="fail";if(pending)span.className+=' pending';return span;}
function errored(pending){var span;if(pending)span=tag('SPAN',"ERROR! [PENDING]");else span=tag('SPAN',"ERROR!");span.className="error";if(pending)span.className+=' pending';return span;}
function empty(pending){var span;if(pending)span=tag('SPAN',"NO ASSERTIONS [PENDING]");else span=tag('SPAN',"NO ASSERTIONS");span.className="empty";if(pending)span.className+=' pending';return span;}}
return module;}();