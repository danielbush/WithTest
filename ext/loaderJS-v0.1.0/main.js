/*
This file is part of LoaderJS, a javascript-based loading program.
Copyright (C) 2009-2010 Daniel Bush
This program is distributed under the terms of the GNU
General Public License.  A copy of the license should be
enclosed with this project in the file LICENSE.  If not
see <http://www.gnu.org/licenses/>.

*/

var $dlb_id_au$=$dlb_id_au$||{};$dlb_id_au$.loader=function(){var module={};module.require=function(files,pathtoroot){var i;var prefix='';if(pathtoroot)prefix=pathtoroot;for(i=0;i<files.length;i++){require(prefix+files[i]);}}
var require=function(jsfile){document.write(unescape("%3Cscript src='"
+jsfile
+"' type='text/javascript'%3E%3C/script%3E"));}
return module;}();var require=$dlb_id_au$.loader.require;
