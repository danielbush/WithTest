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

    // Iterate over an array.
    //
    // Strictly speaking it's not a 'map' because it
    // doesn't return an altered array.

    module.map = function(arr,fn) {
        for(var i=0;i<arr.length;i++) {
            fn(arr[i]);
        }
    }

    // Iterate over a js hash.
    //
    // As per `map` above, it isn't really a map.

    module.omap = function(hash,fn) {
        for(var i in hash) {
            if(hash.hasOwnProperty(i)) {
                fn(i,hash[i]);
            }
        }
    }

    // Get keys of a hash.

    module.keys = function(hash) {
        var keys = [];
        module.omap(hash,function(key,value) {
            keys.push(key);
        });
        return keys;
    }

    // Reserved keywords that should not be used as test labels.

    module.reserved = function(key){
        switch(key) {
        case 'statements':
        case 'helper':

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
            if(/^_/.test(key)) return true;
            return false;
        }
    };

    return module;

}();
