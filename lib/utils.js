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

$dlb_id_au$.unitJS.utils = function() {

    module = {};

    module.map = function(arr,fn) {
        for(var i=0;i<arr.length;i++) {
            fn(arr[i]);
        }
    }

    module.omap = function(hash,fn) {
        for(var i in hash) {
            if(hash.hasOwnProperty(i)) {
                fn(i,hash[i]);
            }
        }
    }

    module.keys = function(hash) {
        var keys = [];
        module.omap(hash,function(key,value) {
            keys.push(key);
        });
        return keys;
    }

    module.reserved = function(key){
        switch(key) {
        case 'setup':
        case 'teardown':
        case 'section':
        case 'sections':
        case 'subsection':
        case 'stats':
        case 'cumulative':
        case 'test':
        case 'tests':
        case 'fn':
            return true;
        default:
            return false;
        }
    };

    // Extract relevant information from `results`.
    //
    // We don't recurse so subsections are not processed.
    // (A results object is similar to a sections object.)

    (function(){

        module.extract = function(results) {
            var o = {};
            o.stats = results.stats;
            o.cumulative = results.cumulative;
            o.subsections = [];
            o.tests = [];
            module.omap(results,function(key,value) {
                if(value.section)
                    o.subsections.push({label:key,section:value});
                if(value.test)
                    o.tests.push({label:key,test:value});
                
            });
            o.subsections = o.subsections.sort(comparefn);
            o.tests = o.tests.sort(comparefn);
            return o;
        }

        var comparefn = function(a,b) {
            if(a.label < b.label) return -1;
            if(a.label == b.label) return 0;
            if(a.label == b.label) return 1;
        }

    })();

    return module;

}();
