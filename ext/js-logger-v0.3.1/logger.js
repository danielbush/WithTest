/*
This file is part of Logger, a javascript-based logger.
Copyright (C) 2009-2010 Daniel Bush
This program is distributed under the terms of the GNU
General Public License.  A copy of the license should be
enclosed with this project in the file LICENSE.  If not
see <http://www.gnu.org/licenses/>.

*/

var $web17_com_au$=$web17_com_au$||{};$web17_com_au$.logger=function(){var ErrorMessages={'E1':"Body-tag not loaded yet - can't set up Logger!",'E2':"Can't work out event handling interface."};var module={};module.Logger=function(logTitle,options){var title=logTitle;var me=this;var body;var n=0,id;var logFrame=document.createElement("div");var logHeader2=document.createElement("div");var logHeader=document.createElement("div");var logBody=document.createElement("div");var logTable=document.createElement("table");var tbody=document.createElement("tbody");var width='250px';var height='500px';var zindex=1000;var logEntry=1;var agt=navigator.userAgent.toLowerCase();var storedPosition;var buttonSpan,minimizeButton;var minimized=false;var wrapped=false;var expandedWidth=false;var dragServer=new DragServer();function init(){body=document.body;if(!body){alert("E1: "+ErrorMessages['E1']);throw new Error("E1: "+ErrorMessages['E1']);}
while(document.getElementById("Logger"+n))n++;ID='Logger'+n;logFrame.style.color='black';logFrame.style.right='0px';logFrame.style.top='0px';logFrame.style.visibility='visible';logFrame.style.position='absolute';logFrame.style.border='solid black 1px';logFrame.style.backgroundColor='white';logFrame.setAttribute("id",ID);logHeader.style.backgroundColor="black";logHeader.style.color="white";logHeader.style.fontFamily="sans-serif";logHeader.style.fontWeight="bold";logHeader.style.fontSize="9pt";logHeader.style.paddingBottom="1px";logHeader.style.cursor="move";logHeader.style.paddingLeft="0.5em";logHeader2.style.backgroundColor="#333";logHeader2.style.color="white";logHeader2.style.fontFamily="sans-serif";logHeader2.style.fontSize="7pt";logHeader2.style.paddingBottom="1px";logHeader2.style.paddingRight="1em";logHeader2.style.cursor="pointer";logHeader2.style.textAlign="right";makeUnselectable(logHeader);makeUnselectable(logHeader2);logFrame.style.width=width;logBody.style.width=width;logBody.style.overflow='scroll';logBody.style.height=height;logFrame.style.zIndex=zindex;logHeader.appendChild(document.createTextNode("log: "+title));logTable.appendChild(tbody);logBody.appendChild(logTable);logFrame.appendChild(logHeader);logFrame.appendChild(logHeader2);logFrame.appendChild(logBody);body.appendChild(logFrame);if(agt.indexOf("msie 6.")==-1&&agt.indexOf("msie 5.")==-1){logFrame.style.position='fixed';}else{}
minimizeButton=document.createElement('SPAN');minimizeButton.appendChild(document.createTextNode(' minimize '));minimizeButton.style.marginRight='0.2em';makeUnselectable(minimizeButton);logHeader2.appendChild(minimizeButton);module.addEvent(minimizeButton,'click',me.minimize);buttonSpan=document.createElement('SPAN');buttonSpan.appendChild(document.createTextNode(' wrap '));buttonSpan.style.marginRight='0.2em';makeUnselectable(buttonSpan);logHeader2.appendChild(buttonSpan);module.addEvent(buttonSpan,'click',me.wrap);me.wrap();buttonSpan=document.createElement('SPAN');buttonSpan.appendChild(document.createTextNode(' 100% '));buttonSpan.style.marginRight='0.2em';makeUnselectable(buttonSpan);logHeader2.appendChild(buttonSpan);module.addEvent(buttonSpan,'click',me.expandWidth);buttonSpan=document.createElement('SPAN');buttonSpan.appendChild(document.createTextNode(' < '));buttonSpan.style.marginRight='0.2em';makeUnselectable(buttonSpan);logHeader2.appendChild(buttonSpan);module.addEvent(buttonSpan,'click',me.increaseWidth);buttonSpan=document.createElement('SPAN');buttonSpan.appendChild(document.createTextNode(' > '));buttonSpan.style.marginRight='0.2em';logHeader2.appendChild(buttonSpan);module.addEvent(buttonSpan,'click',me.decreaseWidth);buttonSpan=document.createElement('SPAN');buttonSpan.appendChild(document.createTextNode(' \\/ '));buttonSpan.style.marginRight='0.2em';makeUnselectable(buttonSpan);logHeader2.appendChild(buttonSpan);module.addEvent(buttonSpan,'click',me.increaseHeight);buttonSpan=document.createElement('SPAN');buttonSpan.appendChild(document.createTextNode(' /\\ '));buttonSpan.style.marginRight='0.2em';makeUnselectable(buttonSpan);logHeader2.appendChild(buttonSpan);module.addEvent(buttonSpan,'click',me.decreaseHeight);buttonSpan=document.createElement('SPAN');buttonSpan.appendChild(document.createTextNode(' snap '));buttonSpan.style.marginRight='0.2em';makeUnselectable(buttonSpan);logHeader2.appendChild(buttonSpan);module.addEvent(buttonSpan,'click',me.snap);buttonSpan=null;dragServer.register(logFrame,logHeader,me.isDraggable);module.addEvent(logHeader,"mousedown",function(){if(!me.isDraggable())return;if(!minimized)me.minimize();});module.addEvent(logHeader,"mouseup",function(){if(!me.isDraggable())return;if(minimized)me.minimize();});processOptions(options);}
function processOptions(options){if(!options)return;if(options.minimized){me.minimize();}}
var makeUnselectable=function(el){el.style.MozUserSelect="none";el.unselectable="on";}
this.log=function(msg){var tr=document.createElement("tr");var td=document.createElement("td");td.style.fontFamily="Courier,monospace";td.style.fontSize="9pt";td.appendChild(document.createTextNode(logEntry+":\t"+msg));tr.appendChild(td);var trs=tbody.getElementsByTagName("tr");tbody.insertBefore(tr,(trs.length>0?trs[0]:null));logEntry++;}
var setWidth=function(w){logFrame.style.width=w;logBody.style.width=w;me.repeatWrap();}
var setHeight=function(h){logBody.style.height=h;}
var storePosition=function(){storedPosition={'top':logFrame.style.top,'right':logFrame.style.right}}
var restorePosition=function(){if(storedPosition){logFrame.style.right=storedPosition['right'];logFrame.style.top=storedPosition['top'];}}
this.minimize=function(){if(minimized){minimized=false;minimizeButton.innerHTML=' minimize ';logBody.style.display="";}
else{logBody.style.display="none";minimizeButton.innerHTML=' maximize ';minimized=true;}}
this.wrap=function(){if(wrapped){logTable.style.width='2000px';}else{if(expandedWidth){logTable.style.width='90%';}else{logTable.style.width=parseInt(width)-20+'px';}}
wrapped=!wrapped;}
this.repeatWrap=function(){wrapped=!wrapped;me.wrap();}
this.expandWidth=function(){if(expandedWidth){expandedWidth=false;setWidth(width);restorePosition();}else{storePosition();logFrame.style.right='0px';logFrame.style.top='0px';expandedWidth=true;setWidth('100%');}}
this.increaseWidth=function(){if(expandedWidth)return;width=parseInt(width)+20+'px';setWidth(width);}
this.decreaseWidth=function(){if(expandedWidth)return;if(parseInt(width)>20)width=parseInt(width)-20+'px';setWidth(width);}
this.increaseHeight=function(){height=parseInt(height)+30+'px';setHeight(height);}
this.decreaseHeight=function(){if(parseInt(height)>30)height=parseInt(height)-30+'px';setHeight(height);}
this.snap=function(){logFrame.style.right='0px';logFrame.style.top='0px';storePosition();}
this.isDraggable=function(){if(expandedWidth)return false;return true;}
function DragServer(){var me=this;var body=document.body;var mouseX,objX;var mouseY,objY;var obj=null;var dragOn=function(e,draggable,canDrag){if(!canDrag())return;obj=draggable;mouseX=parseInt(e.clientX);mouseY=parseInt(e.clientY);objX=parseInt(obj.style.right+0);objY=parseInt(obj.style.top+0);module.addEvent(document,"mousemove",drag);}
var dragOff=function(e,draggable,canDrag){if(!canDrag())return;module.removeEvent(document,"mousemove",drag);obj=null;}
var drag=function(e){obj.style.right=objX-(e.clientX-mouseX)+'px';obj.style.top=objY+e.clientY-mouseY+'px';}
var registrations={};this.register=function(draggable,dragHandle,canDrag){module.addEvent(dragHandle,"mousedown",function(e){dragOn(e,draggable,canDrag);});module.addEvent(dragHandle,"mouseup",function(e){dragOff(e,draggable,canDrag);});}}
init();return this;}
module.addEvent=function(obj,eventType,fn){if(obj.addEventListener){obj.addEventListener(eventType,fn,false);}
else if(obj.attachEvent){obj.attachEvent('on'+eventType,fn);}
else{throw new Error('E2: '+ErrorMessages['E2']);}}
module.removeEvent=function(obj,eventType,fn){if(obj.removeEventListener){obj.removeEventListener(eventType,fn,false);}
else if(obj.detachEvent){obj.detachEvent('on'+eventType,fn);}
else{throw new Error('E2: '+ErrorMessages['E2']);}}
return module;}();