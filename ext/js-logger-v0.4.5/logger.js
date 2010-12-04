/*
This file is part of Logger, a javascript-based logger.
Copyright (C) 2009-2010 Daniel Bush
This program is distributed under the terms of the GNU
General Public License.  A copy of the license should be
enclosed with this project in the file LICENSE.  If not
see <http://www.gnu.org/licenses/>.

*/

var $web17_com_au$=$web17_com_au$||{};$web17_com_au$.pretty_print=function(){var module={};var NEWLINE='\r\n';var rx={},rxg={};rx.newline=/\r?\n/;rxg.newline=/\r?\n/g;var map=function(f,arr){for(var i=0;i<arr.length;i++){f(arr[i]);}}
module.pp=function(obj,nested){var i;var indent='';var indent2='';var str='';if(nested>module.pp.nested)return'';if(!nested)nested=0;if(module.pp.extended){for(indent='  ',i=nested;i>0;i--){indent+='  ';if(i>0)indent2+='  ';}}
if(obj==undefined||obj==null){if(obj==undefined)return'undefined';if(obj==null)return'null';if(nested==0&&obj==null)return'null';}
switch(typeof(obj)){case'xml':str=obj.toXMLString();str=str.replace(rxg.newline,'\\n').replace(/  */g,' ');if(!module.pp.extended)
str=str.replace(rxg.newline,' ').replace(/  */g,' ');break;case'object':if(obj instanceof String){str='"'+obj+'"';}else if(obj instanceof Array){str+='[';if(module.pp.extended)str+=NEWLINE;map(function(i){if(obj[i]!==obj){str+=indent+(module.pp(i,nested+1)+', ');if(module.pp.extended)str+=NEWLINE;}else{str+=indent+' (self), ';if(module.pp.extended)str+=NEWLINE;}},obj);str+=indent2+']';if(module.pp.extended)str+=NEWLINE;}else if(!(obj instanceof Object)){if(java&&java.lang){if(obj['class']===java.lang.Class){str=obj;}
else str=obj['class'];}}else{var count=0;str+='{';if(module.pp.extended)str+=NEWLINE;try{for(var n in obj){if(count++>module.pp.nested_property_limit&&nested>0){str+=(indent+'...');if(module.pp.extended)str+=NEWLINE;break;}
if(obj!==obj[n]){str+=indent+
(n+': '+module.pp(obj[n],nested+1).replace(/\r?\n *$/,' ')+', ');if(module.pp.extended)str+=NEWLINE;}
else{str+=(indent+n+': (self), ');if(module.pp.extended)str+=NEWLINE;}}}catch(e){str+='[error:'+n+']'}
str+=indent2+'}';if(module.pp.extended)str+=NEWLINE;}
break;case'string':str+=('"'+obj+'"');if(!module.pp.newlines)str=str.replace(rxg.newline,'\\n');break;case'function':if(nested>0)str+='f()';else{try{if(module.pp.extended)str=obj.toString();else str=obj.toString().replace(rxg.newline,'').replace(/  */g,' ');}catch(e){str=obj;}}
break;default:str=obj;break;}
if(module.pp.truncate)
switch(typeof(obj)){case'xml':case'string':case'function':try{if(str.length>300)
str=str.substring(0,149)+'... ... ...';}catch(e){}}
if(nested==0)return str;return str+'';}
module.pp.nested=2;module.pp.truncate=true;module.pp.nested_property_limit=10;module.pp.extended=true;return module;}();var $web17_com_au$=$web17_com_au$||{};$web17_com_au$.logger=function(){var pp_module=$web17_com_au$.pretty_print;var module={};var pp=null;if(pp_module)pp=pp_module.pp;var ErrorMessages={'E1':"Body-tag not loaded yet - can't set up Logger!",'E2':"Can't work out event handling interface."};var setProperty=function(obj,properties){if(!properties)return;for(var i in properties){if(properties.hasOwnProperty(i)){obj[i]=properties[i];}}}
module.LogFrame=module.Logger=function(logTitle,options){var me=this;var title=logTitle;var READY=false;var body=document.createDocumentFragment();me.logs={};me.logger=null;var n=0,id;var logFrame=document.createElement("div");var logHeader=document.createElement("div");var logBody=document.createElement("div");var toolbars={};toolbars.buttons=document.createElement("div");toolbars.logs=document.createElement("div");var width='250px';var store_width=width;var height='500px';var zindex=1000;var agt=navigator.userAgent.toLowerCase();var storedPosition;var buttons={};var minimized=false;var wrapped=false;var expandedWidth=false;var dragServer=new DragServer();var ready_or_fail=function(){body=document.body;if(!body){alert("E1: "+ErrorMessages['E1']);throw new Error("E1: "+ErrorMessages['E1']);}}
var ready_or_wait=function(){var id;var tries=0;var interval=100;var fail_after=10000;var check_body=function(){if(document.body){document.body.appendChild(body);body=document.body;READY=true;window.clearInterval(id);}
if(interval*tries>fail_after){window.clearInterval(id);}
tries++;}
id=window.setInterval(check_body,interval);}
var makeButton=function(label,f,menuNode,style){var node=document.createElement('SPAN');node.appendChild(document.createTextNode(' '+label+' '));node.style.marginRight='0.2em';makeUnselectable(node);menuNode.appendChild(node);module.addEvent(node,'click',f);if(style)setProperty(node.style,style);return node;}
function init(){ready_or_wait();while(document.getElementById("Logger"+n))n++;ID='Logger'+n;setProperty(logFrame.style,{color:'black',right:'0px',top:'0px',visibility:'visible',position:'absolute'});logFrame.setAttribute("id",ID);setProperty(logHeader.style,{backgroundColor:"black",color:"white",fontFamily:"sans-serif",fontWeight:"bold",fontSize:"9pt",cursor:"move",paddingBottom:"1px",paddingLeft:"10px"});for(var i in toolbars){setProperty(toolbars[i].style,{backgroundColor:"#333",color:"white",fontFamily:"sans-serif",fontSize:"7pt",paddingBottom:"1px",paddingRight:"1em",paddingLeft:"10px",cursor:"pointer",textAlign:"right"});}
setProperty(toolbars.logs.style,{textAlign:'left',fontSize:'9pt'});makeUnselectable(logHeader);makeUnselectable(toolbars.buttons);makeUnselectable(toolbars.logs);setProperty(logFrame.style,{width:width,height:height,zIndex:zindex});setProperty(logBody.style,{border:'solid black 1px',width:width,overflow:'scroll',height:'100%',backgroundColor:'white'});logFrame.appendChild(logHeader);logFrame.appendChild(toolbars.buttons);logFrame.appendChild(toolbars.logs);logFrame.appendChild(logBody);body.appendChild(logFrame);me.add(title);me.change(title);if(agt.indexOf("msie 6.")==-1&&agt.indexOf("msie 5.")==-1){logFrame.style.position='fixed';}else{}
buttons.minimize=makeButton('minimize',me.minimize,toolbars.buttons);makeButton('wrap',me.wrap,toolbars.buttons);makeButton('100%',me.expandWidth,toolbars.buttons);makeButton('<',me.increaseWidth,toolbars.buttons);makeButton('>',me.decreaseWidth,toolbars.buttons);makeButton('\\/',me.increaseHeight,toolbars.buttons);makeButton('/\\',me.decreaseHeight,toolbars.buttons);makeButton('snap',me.snap,toolbars.buttons);dragServer.register(logFrame,logHeader,me.isDraggable);module.addEvent(logHeader,"mousedown",function(){if(!me.isDraggable())return;if(!minimized)me.minimize();});module.addEvent(logHeader,"mouseup",function(){if(!me.isDraggable())return;if(minimized)me.minimize();});if(options){options.minimized&&me.minimize();options.width&&me.setWidth(options.width);options.height&&me.setHeight(options.height);options.wrap&&me.wrap();}}
me.add=function(name){me.logs[name]=new module.Log(name);var b=makeButton(name,function(){me.change(name)},toolbars.logs,{padding:'3px'});me.logs[name].button=b;me.logs[name].notify=function(){b.innerHTML=name+'['+(me.logs[name].size()-1)+'] '}
return me.logs[name];}
me.change=function(name){if(me.logs[name]){logHeader.innerHTML="log: "+name;while(logBody.firstChild)
logBody.removeChild(logBody.firstChild);logBody.appendChild(me.logs[name].node);me.logger=me.logs[name];me.repeatWrap();}
for(var i in me.logs){if(me.logs[i].button){if(i==name){if(me.logs[i].button){me.logs[i].button.style.backgroundColor='#ccc';me.logs[i].button.style.color='black';}}else{if(me.logs[i].button){me.logs[i].button.style.backgroundColor='';me.logs[i].button.style.color='';}}}}}
var makeUnselectable=function(el){el.style.WebkitUserSelect="none";el.style.MozUserSelect="none";el.unselectable="on";}
me.setWidth=function(w){logFrame.style.width=w;logBody.style.width=w;width=w;me.repeatWrap();}
me.setHeight=function(h){logFrame.style.height=h;logBody.style.height='100%';height=h;}
var storePosition=function(){storedPosition={'top':logFrame.style.top,'right':logFrame.style.right}}
var restorePosition=function(){if(storedPosition){logFrame.style.right=storedPosition['right'];logFrame.style.top=storedPosition['top'];}}
me.minimize=function(){if(minimized){minimized=false;buttons.minimize.innerHTML=' minimize ';logBody.style.display="";}
else{logBody.style.display="none";buttons.minimize.innerHTML=' maximize ';minimized=true;}}
me.wrap=function(){if(wrapped){me.logger.node.style.width='2000px';}else{if(expandedWidth){me.logger.node.style.width='90%';}else{me.logger.node.style.width=parseInt(width)-20+'px';}}
wrapped=!wrapped;}
me.repeatWrap=function(){wrapped=!wrapped;me.wrap();}
me.expandWidth=function(){if(expandedWidth){expandedWidth=false;me.setWidth(store_width);restorePosition();}else{storePosition();logFrame.style.right='0px';logFrame.style.top='0px';expandedWidth=true;store_width=width;me.setWidth('100%');}}
me.increaseWidth=function(){if(expandedWidth)return;width=parseInt(width)+20+'px';me.setWidth(width);}
me.decreaseWidth=function(){if(expandedWidth)return;if(parseInt(width)>20)width=parseInt(width)-20+'px';me.setWidth(width);}
me.increaseHeight=function(){height=parseInt(height)+30+'px';me.setHeight(height);}
me.decreaseHeight=function(){if(parseInt(height)>30)height=parseInt(height)-30+'px';me.setHeight(height);}
me.snap=function(){logFrame.style.right='0px';logFrame.style.top='0px';storePosition();}
me.isDraggable=function(){if(expandedWidth)return false;return true;}
init();return me;}
module.Log=function(name){var me=this;var title=name;var logTable=document.createElement("table");var tbody=document.createElement("tbody");var logCount=1;tbody.style.fontFamily="Courier,monospace";tbody.style.fontSize="9pt";logTable.appendChild(tbody);me.node=logTable;me.size=function(){return logCount;}
var makeLogEntry=function(node,styles){var tr=document.createElement("tr");var td0=document.createElement("td");var td=document.createElement("td");td0.appendChild(document.createTextNode(logCount+': '));setProperty(td0.style,{width:'1%',color:'red',verticalAlign:'top'});setProperty(td.style,{cursor:'pointer'});setProperty(td.style,styles);td.appendChild(node);tr.appendChild(td0);tr.appendChild(td);var trs=tbody.getElementsByTagName("tr");tbody.insertBefore(tr,(trs.length>0?trs[0]:null));logCount++;if(me.notify)me.notify();}
var parseLogArgs=function(){var msg='';var p;for(var i=0;i<arguments.length;i++){if(arguments[i]instanceof Array){if(pp){for(var j=0;j<arguments[i].length;j++){if(j!=0)msg+=',';p=pp(arguments[i][j]);msg+=(p);}}else msg+=arguments[i];}else msg+=arguments[i];}
return msg;}
me.makeLogFunction=function(name,options){return me[name]=function(){var span=document.createElement('SPAN');span._text=parseLogArgs.apply(me,arguments);span._tnode=document.createTextNode(span._text);span.innerHTML=span._text;makeLogEntry(span,options);span.onclick=function(){var pre;if(span._pre){span._pre=false;while(span.firstChild)
span.removeChild(span.firstChild);span.innerHTML=span._text;}else{span._pre=true;while(span.firstChild)
span.removeChild(span.firstChild);span.appendChild(document.createElement('PRE'));span.firstChild.appendChild(span._tnode);}}};}
me.makeLogFunction('log');me.makeLogFunction('alert',{backgroundColor:'red',color:'white',fontWeight:'bold'});me.makeLogFunction('red',{backgroundColor:'#fee',color:'red',fontWeight:'bold'});me.makeLogFunction('green',{backgroundColor:'#afa',color:'green',fontWeight:'bold'});me.makeLogFunction('blue',{backgroundColor:'#eef',color:'blue',fontWeight:'bold'});me.makeLogFunction('yellow',{backgroundColor:'#ff8',color:'black',fontWeight:'bold'});me.divider=function(){makeLogEntry(document.createElement('HR'));}}
module.addEvent=function(obj,eventType,fn){if(obj.addEventListener){obj.addEventListener(eventType,fn,false);}
else if(obj.attachEvent){obj.attachEvent('on'+eventType,fn);}
else{throw new Error('E2: '+ErrorMessages['E2']);}}
module.removeEvent=function(obj,eventType,fn){if(obj.removeEventListener){obj.removeEventListener(eventType,fn,false);}
else if(obj.detachEvent){obj.detachEvent('on'+eventType,fn);}
else{throw new Error('E2: '+ErrorMessages['E2']);}}
function DragServer(){var me=this;var body=document.body;var mouseX,objX;var mouseY,objY;var obj=null;var dragOn=function(e,draggable,canDrag){if(!canDrag())return;obj=draggable;mouseX=parseInt(e.clientX);mouseY=parseInt(e.clientY);objX=parseInt(obj.style.right+0);objY=parseInt(obj.style.top+0);module.addEvent(document,"mousemove",drag);}
var dragOff=function(e,draggable,canDrag){if(!canDrag())return;module.removeEvent(document,"mousemove",drag);obj=null;}
var drag=function(e){obj.style.right=objX-(e.clientX-mouseX)+'px';obj.style.top=objY+e.clientY-mouseY+'px';}
var registrations={};me.register=function(draggable,dragHandle,canDrag){module.addEvent(dragHandle,"mousedown",function(e){dragOn(e,draggable,canDrag);});module.addEvent(dragHandle,"mouseup",function(e){dragOff(e,draggable,canDrag);});}}
return module;}();