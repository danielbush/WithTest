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

var $dlb_id_au$=$dlb_id_au$||{};$dlb_id_au$.unitJS=$dlb_id_au$.unitJS||{};$dlb_id_au$.unitJS.utils=function(){module={};module.map=function(arr,fn){for(var i=0;i<arr.length;i++){fn(arr[i]);}}
module.omap=function(hash,fn){for(var i in hash){if(hash.hasOwnProperty(i)){fn(i,hash[i]);}}}
module.keys=function(hash){var keys=[];module.omap(hash,function(key,value){keys.push(key);});return keys;}
module.reserved=function(key){switch(key){case'setup':case'teardown':case'section':case'sections':case'subsection':case'stats':case'cumulative':case'test':case'tests':case'fn':return true;default:return false;}};(function(){module.extract=function(results){var o={};o.stats=results.stats;o.cumulative=results.cumulative;o.subsections=[];o.tests=[];module.omap(results,function(key,value){if(value.section)
o.subsections.push({label:key,section:value});if(value.test)
o.tests.push({label:key,test:value});});o.subsections=o.subsections.sort(comparefn);o.tests=o.tests.sort(comparefn);return o;}
var comparefn=function(a,b){if(a.label<b.label)return-1;if(a.label==b.label)return 0;if(a.label==b.label)return 1;}})();return module;}();$dlb_id_au$.unitJS.assertions=function(){var module={};var stats;var utils={};module.run=function(test,params){stats={};stats.status='PASS';stats.assertions=0;stats.assertion_level=0;if(!test){stats.status='NOT IMPLEMENTED';return stats;}
if(params&&params.setup&&typeof(params.setup)=='function')params.setup();try{test();}catch(e){stats.unitjs='';stats.message=e.message;stats.comment=e.comment;stats.stack=e.stack;if(e.isFailure){stats.status='FAIL';}
else{stats.status='ERROR';}}
if(stats.assertions===0){if(stats.status=='PASS')
stats.status='NO ASSERTIONS';}
if(stats.status=='FAIL'){stats.unitjs+='Assertion #'+stats.assertions+' failed.';}
else if(stats.status=='ERROR'){if(stats.assertions===0){stats.unitjs+='Error occurred BEFORE assertion #1.';}else{stats.unitjs+='Error occurred ON or AFTER assertion #'+
stats.assertions+'.';}}
if(params&&params.teardown&&typeof(params.teardown)=='function')params.teardown();return stats;}
function before_assert(){if(stats){stats.assertion_level++;if(stats.assertion_level==1){stats.assertions++;}}}
function after_assert(){if(stats){stats.assertion_level--;}}
var _UNDEFINED_VALUE;function _assert(comment,booleanValue,assertionTypeMessage){if(!booleanValue){utils.fail(comment,assertionTypeMessage);}}
module.assert=function(){utils._validateArguments(1,arguments);var booleanValue=utils.nonCommentArg(1,1,arguments);if(typeof(booleanValue)!='boolean')
utils.error('Bad argument to assert(boolean)');_assert(utils.commentArg(1,arguments),booleanValue===true,'Call to assert(boolean) with false');}
module.assertTrue=function(){utils._validateArguments(1,arguments);var booleanValue=utils.nonCommentArg(1,1,arguments);if(typeof(booleanValue)!='boolean')
utils.error('Bad argument to assertTrue(boolean)');_assert(utils.commentArg(1,arguments),booleanValue===true,'Call to assertTrue(boolean) with false');}
module.assertFalse=function(){utils._validateArguments(1,arguments);var booleanValue=utils.nonCommentArg(1,1,arguments);if(typeof(booleanValue)!='boolean')
utils.error('Bad argument to assertFalse(boolean)');_assert(utils.commentArg(1,arguments),booleanValue===false,'Call to assertFalse(boolean) with true');}
module.assertEquals=function(){utils._validateArguments(2,arguments);var var1=utils.nonCommentArg(1,2,arguments);var var2=utils.nonCommentArg(2,2,arguments);_assert(utils.commentArg(2,arguments),var1===var2,'Expected '+
utils._displayStringForValue(var1)+' but was '+
utils._displayStringForValue(var2));}
module.assertNotEquals=function(){utils._validateArguments(2,arguments);var var1=utils.nonCommentArg(1,2,arguments);var var2=utils.nonCommentArg(2,2,arguments);_assert(utils.commentArg(2,arguments),var1!==var2,'Expected not to be '+
utils._displayStringForValue(var2));}
module.assertNull=function(){utils._validateArguments(1,arguments);var aVar=utils.nonCommentArg(1,1,arguments);_assert(utils.commentArg(1,arguments),aVar===null,'Expected '+
utils._displayStringForValue(null)+' but was '+
utils._displayStringForValue(aVar));}
module.assertNotNull=function(){utils._validateArguments(1,arguments);var aVar=utils.nonCommentArg(1,1,arguments);_assert(utils.commentArg(1,arguments),aVar!==null,'Expected not to be '+
utils._displayStringForValue(null));}
module.assertUndefined=function(){utils._validateArguments(1,arguments);var aVar=utils.nonCommentArg(1,1,arguments);_assert(utils.commentArg(1,arguments),aVar===_UNDEFINED_VALUE,'Expected '+
utils._displayStringForValue(_UNDEFINED_VALUE)+' but was '+
utils._displayStringForValue(aVar));}
module.assertNotUndefined=function(){utils._validateArguments(1,arguments);var aVar=utils.nonCommentArg(1,1,arguments);_assert(utils.commentArg(1,arguments),aVar!==_UNDEFINED_VALUE,'Expected not to be '+
utils._displayStringForValue(_UNDEFINED_VALUE));}
module.assertNaN=function(){utils._validateArguments(1,arguments);var aVar=utils.nonCommentArg(1,1,arguments);_assert(utils.commentArg(1,arguments),isNaN(aVar),'Expected NaN');}
module.assertNotNaN=function(){utils._validateArguments(1,arguments);var aVar=utils.nonCommentArg(1,1,arguments);_assert(utils.commentArg(1,arguments),!isNaN(aVar),'Expected not NaN');}
module.assertObjectEquals=function(){utils._validateArguments(2,arguments);var var1=utils.nonCommentArg(1,2,arguments);var var2=utils.nonCommentArg(2,2,arguments);var type1=utils._trueTypeOf(var1);var type2=utils._trueTypeOf(var2);var msg=utils.commentArg(2,arguments)?utils.commentArg(2,arguments):'';var isSame=(var1===var2);var sameType=(type1==type2);var isEqual=isSame||sameType;if(!isSame){switch(type1){case'String':if(type2!='String'){isEqual=false;break;}
isEqual=(var1==var2);break;case'Number':if(type2!='Number'){isEqual=false;break;}
isEqual=(var1==var2);break;case'Boolean':case'Date':isEqual=(var1===var2);break;case'RegExp':case'Function':isEqual=(var1.toString()===var2.toString());break;default:var i;if(isEqual=(var1.length===var2.length))
for(i in var1)
module.assertObjectEquals(msg+' found nested '+
type1+'@'+i+'\n',var1[i],var2[i]);}
_assert(msg,isEqual,'Expected '+utils._displayStringForValue(var1)+' but was '+utils._displayStringForValue(var2));}}
module.assertArrayEquals=module.assertObjectEquals;module.assertEvaluatesToTrue=function(){utils._validateArguments(1,arguments);var value=utils.nonCommentArg(1,1,arguments);if(!value)
utils.fail('',utils.commentArg(1,arguments));}
module.assertEvaluatesToFalse=function(){utils._validateArguments(1,arguments);var value=utils.nonCommentArg(1,1,arguments);if(value)
utils.fail('',utils.commentArg(1,arguments));}
module.assertHTMLEquals=function(){utils._validateArguments(2,arguments);var var1=utils.nonCommentArg(1,2,arguments);var var2=utils.nonCommentArg(2,2,arguments);var var1Standardized=utils.standardizeHTML(var1);var var2Standardized=utils.standardizeHTML(var2);_assert(utils.commentArg(2,arguments),var1Standardized===var2Standardized,'Expected '+
utils._displayStringForValue(var1Standardized)+' but was '+
utils._displayStringForValue(var2Standardized));}
module.assertHashEquals=function(){utils._validateArguments(2,arguments);var var1=utils.nonCommentArg(1,2,arguments);var var2=utils.nonCommentArg(2,2,arguments);for(var key in var1){module.assertNotUndefined("Expected hash had key "+key+" that was not found",var2[key]);module.assertEquals("Value for key "+key+" mismatch - expected = "+var1[key]+", actual = "+var2[key],var1[key],var2[key]);}
for(var key in var2){module.assertNotUndefined("Actual hash had key "+key+" that was not expected",var1[key]);}}
module.assertRoughlyEquals=function(){utils._validateArguments(3,arguments);var expected=utils.nonCommentArg(1,3,arguments);var actual=utils.nonCommentArg(2,3,arguments);var tolerance=utils.nonCommentArg(3,3,arguments);module.assertTrue("Expected "+expected+", but got "+actual+" which was more than "+tolerance+" away",Math.abs(expected-actual)<tolerance);}
module.assertContains=function(){utils._validateArguments(2,arguments);var contained=utils.nonCommentArg(1,2,arguments);var container=utils.nonCommentArg(2,2,arguments);module.assertTrue("Expected '"+container+"' to contain '"+contained+"'",container.indexOf(contained)!=-1);}
module.assertFailure=function(comment,errorObject){module.assertNotNull(comment,errorObject);module.assert(comment,errorObject.isFailure);module.assertNotUndefined(comment,errorObject.comment);}
module.assertError=function(comment,errorObject){module.assertNotNull(comment,errorObject);module.assertUndefined(comment,errorObject.isFailure);module.assertNotUndefined(comment,errorObject.description);}
for(var i in module){if(/^assert/.test(i)){module[i]=function(assert_fn){return function(){before_assert();assert_fn.apply(this,arguments);after_assert();};}(module[i]);}}
utils._trueTypeOf=function(something){var result=typeof something;try{switch(result){case'string':case'boolean':case'number':break;case'object':case'function':switch(something.constructor){case String:result='String';break;case Boolean:result='Boolean';break;case Number:result='Number';break;case Array:result='Array';break;case RegExp:result='RegExp';break;case Function:result='Function';break;default:var m=something.constructor.toString().match(/function\s*([^( ]+)\(/);if(m)
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
return module;}();$dlb_id_au$.unitJS.runner=function(){var assertions=$dlb_id_au$.unitJS.assertions;var utils=$dlb_id_au$.unitJS.utils;var module={};var map=utils.map;var omap=utils.omap;var errors=module.errors={'001':'You used a reserved word for a test label in your test definitions.','002':'You used a test with a label that is actually a section in your test statements.','003':'Your tests have a subsection that is not present in your statements.','004':"Invalid statement format; did you specify a section field for all sections and subsections?",'005':"Your statements are null or don't exist.",'006':"You have a label in your statement but nothing against it or it is invalid.",'007':"A test is invalid - should be function or hash of functions.",'008':"You've defined both a test and an inline test (double definition error) - you can only have one definition."};module.disable_alert=false;var error=function(code,extra){var msg=code+': '+errors[code];if(extra){msg+=' '+extra;}
if(!module.disable_alert)alert(msg);throw new Error(msg);};module.run=function(test_module){var results,section;module.validate(test_module.statements);test_module=module.clone(test_module);section=module.prepare(test_module.statements,test_module.tests);results=module.process(section);results=module.total(results);return results;}
var validate_statement=function(obj,label){if(!obj){if(label)error('006','Label is '+label);else error('006');}
if(typeof(obj)=='string')return true;if(obj.section)return true;if(obj.statements)return true;if(obj.test&&obj.fn&&typeof(obj.fn)=='function'&&typeof(obj.test)=='string')return true;if(label)error('004','Label is '+label);else error('004');}
module.validate=function(statements){if(!statements)error('005');if(!statements.section||typeof(statements.section)!='string')error('004');omap(statements,function(label,val){if(!utils.reserved(label)){validate_statement(val,label);if(val.statements){module.validate(val.statements);}
else if(val.section){module.validate(val);}}
else{switch(label){case'setup':case'teardown':case'section':case'statements':break;default:error('001','Label is '+label);}}});}
module.clone=function(thing,obj){if(!obj)obj={};omap(thing,function(label,val){if(label=='statements'||label=='tests'||val.section||val.statements||val.tests)
{obj[label]=module.clone(val,{});}else{obj[label]=val;}});return obj;}
module.prepare=function(statements,tests){omap(statements,function(label,val){if(val.statements){statements[label]=val.statements;module.prepare(val.statements,val.tests);}});omap(tests,function(label,val){if(label=='setup'||label=='teardown'){statements[label]=val;}else if(!val){}else if(typeof(val)=='function'){if(statements[label]){if(statements[label].section)
error('002','Label is: '+label);if(statements[label].test&&statements[label].fn){error('008','Label is: '+label);}
if(typeof(statements[label])=='string'){statements[label]={test:statements[label],fn:val};}}else{statements[label]={test:'***Unused test implementation / missing test statement!',fn:val,unused:true};}}else if(typeof(val)=='object'){if(!statements[label]){error('003','Label is '+label);}
module.prepare(statements[label],tests[label]);}
else{error('007','Label is '+label);}});return statements;};module.process=function(section,results){if(!results)results={};results.section=section.section;omap(section,function(label,val){if(!utils.reserved(label)){if(val.fn&&val.test){results[label]={test:val.test,stats:assertions.run(val.fn,{setup:section.setup,teardown:section.teardown})};if(val.unused){results[label].stats.status='MISSING STATEMENT';}}
else if(typeof(val)=='string'){results[label]={test:val,stats:assertions.run(null)};}
else if(val.section){module.process(val,results[label]={});}}});return results;};(function(){module.total=function(results){var e;e=extract(results);results.stats=do_totals(e.tests);results.cumulative=sum_stats(make_stats(),results.stats);if(e.tests.length==0&&e.subsections.length==0)
results.cumulative.empties++;map(e.subsections,function(subsection){var subresults=module.total(subsection);results.cumulative=sum_stats(results.cumulative,subresults.cumulative);});set_status(results.stats);set_status(results.cumulative);return results;}
var set_status=function(stats){stats.status='OTHER';if(stats.pass>0)stats.status='PASS';if(stats.fail>0)stats.status='FAIL';if(stats.error>0)stats.status='ERROR';}
var do_totals=function(tests){var stats=make_stats();map(tests,function(test){stats.assertions+=test.stats.assertions;stats.tests++;switch(test.stats.status){case'NOT IMPLEMENTED':stats.not_implemented++;break;case'NO ASSERTIONS':stats.no_assertions++;break;case'MISSING STATEMENT':stats.missing_statements++;break;case'PASS':stats.pass++;break;case'FAIL':stats.fail++;break;case'ERROR':stats.error++;break;default:break;}});return stats;}
var extract=function(results){var tests=[],subsections=[];omap(results,function(key,val){if(val.section){subsections.push(val);return;}
if(val.test){tests.push(val);return;}});return{tests:tests,subsections:subsections};}
var make_stats=function(){return{assertions:0,pass:0,fail:0,error:0,tests:0,empties:0,no_assertions:0,not_implemented:0,missing_statements:0};}
var sum_stats=function(a,b){var stats=make_stats();if(!b)b=make_stats();omap(stats,function(key,value){stats[key]=a[key]+b[key];});return stats;}})();return module;}();
