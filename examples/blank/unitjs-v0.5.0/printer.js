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

$dlb_id_au$.unitJS.printers = function() {

    var utils  = $dlb_id_au$.unitJS.utils;

    var module = {};
    var map  = utils.map;
    var omap = utils.omap;


    module.print_summary = function(results) {
        var stats = results.cumulative;
        var t = tag('div',{className:'summary'});
        t.appendChild(tag('h2',{text:'Summary'}));
        t.appendChild(tag('span',{text:'Tests: '+stats.tests}));
        t.appendChild(tag('span',{text:'Failed: '+stats.fail}));
        t.appendChild(tag('span',{text:'Errors: '+stats.error}));
        t.appendChild(tag('span',{text:'Other: '+
                                  (stats.no_assertions+
                                   stats.not_implemented+
                                   stats.missing_statements)}));
        t.appendChild(tag('span',{text:'Pass: '+stats.pass}));
        t.appendChild(tag('br'));
        t.appendChild(tag('span',{text:'Assertions: '+stats.assertions}));
        return t;
    };

    // Recursively print `results`; by printing we generate
    // tags with relevant text and style rules.  The root tag
    // is returned.
    // Tests, subsections are printed in
    // lexicographical order of labels...
    // 
    // It's assumed that `results` includes cumulative stats.

    (function(){

        module.print = function(results,section_key) {
            var a,b,c,body;
            var keys = utils.keys(results).sort();
            var stats = results.cumulative;
            var t = tag('div',{className:'section'});

            // Stash sections cumulative stats in section node...
            t.unitjs = t.unitjs || {};
            t.unitjs.cumulative = stats;

            // Create section div with relevant parts...
            t.appendChild(b=tag('div',{className:'title ' +
                                       get_status_css(stats)}))
            b.appendChild(c=tag('span',{className:'status'}));
            c.appendChild(tag('span',{
                text:' '+section_status(results.cumulative)+' '}))
            b.appendChild(c=tag('h2',{className:''}));

            if(section_key) {
                c.appendChild(tag('span',{className:'label',
                                          text:section_key+':'}));
            }

            c.appendChild(tag('span',{className:'name',
                                      text:results.section}));

            b.appendChild(tag('div',{className:'clear'}));

            t.appendChild(body=tag('div',{className:'body'}));
            
            // Make sections collapsible.
            b.onclick = function(section_div){
                return function(){
                    if(body.style.display=='none' ) {
                        module.show_all(section_div);
                    } else {
                        body.style.display='none';
                    }
                };
            }(t);

            // Now populate the section's body with its
            // subsections and tests...

            map(keys,function(key) {
                var stats;
                if(utils.reserved(key)) {
                } else {
                    if(results[key].section) {
                        a = module.print(results[key],key);
                        body.appendChild(a);
                    } else if(results[key].test) {
                        stats = results[key].stats;
                        body.appendChild(a=tag(
                            'div',{className:'test ' +
                                   get_status_css(stats)}));
                        // Stash test stats in test node...
                        a.unitjs = a.unitjs || {};
                        a.unitjs.stats = stats;
                        a.appendChild(b=tag('h3',{className:'name'}));
                        b.appendChild(tag('span',{
                            className:'label',text:key+': ' }));
                        b.appendChild(tag('span',{
                            text:results[key].test}));

                        a.appendChild(tag(
                            'span',{className:'status ' +
                                    get_status_css(stats),
                                    text:stats.status}));
                        a.appendChild(tag('div',{className:'clear'}));

                        // Combine unitjs-comment with assertion
                        // comment...
                        a.appendChild(tag(
                            'div',{className:'comment',
                                   text:get_comment(stats)}));
                        a.appendChild(tag(
                            'div',{className:'message',
                                   text:get_error_message(stats)}));
                        if(stats.stack) {
                            a.appendChild(tag(
                                'pre',{className:'stack',
                                       text:get(stats,'stack')}));
                        }
                    }
                }
            });
            return t;
        }

        // Combine unitjs and assertion comments into one string...

        var get_comment = function(stats) {
            if(stats.unitjs || stats.comment) {
                return get(stats,'unitjs')+' Comment: '+
                    get(stats,'comment');
            }
            else return '';
        }

        var get_error_message = function(stats) {
            if(stats.message) {
                return 'Error message: '+ stats.message ;
            }
            else return '';
        }

        // For the css we use standard class names to
        // represent different status; return them here...

        var get_status_css = function(stats) {
            switch(stats.status) {
            case 'PASS': return 'pass';
            case 'MISSING STATEMENT': return 'error';
            case 'ERROR': return 'error';
            case 'FAIL': return 'fail';
            default: return 'other';
            }
        }

        // Get a property if it exists; else return empty string...

        var get = function(obj,property) {
            if(obj[property]) return obj[property];
            return '';
        }

        // Return a string representing the status of each section...

        var section_status = function(stats){
            var unimplemented = stats.not_implemented+stats.no_assertions;
            unimplemented = (unimplemented>0 ? 'Unimplemented: '+
                             unimplemented : '');
            return '(Tests: '+stats.tests+'; '+
                ((stats.error==0 && stats.fail==0) ?
                 'Passed; '+unimplemented :
                 'Pass:'+stats.pass+
                 ' Failures:'+stats.fail+' Errors:'+stats.error+' '+
                 unimplemented) +
                ')';
        }



    })();


    var tag = function(name,params) {
        var el = document.createElement(name);
        if(params) {
            omap(params,function(key,val){
                switch(key){
                case 'text':
                    var t = document.createTextNode(val);
                    el.appendChild(t);
                    break;
                case 'className':
                    key = 'class';
                default:
                    el.setAttribute('class',params.className);
                }
            });
        }
        return el;
    };


    // Show only sections and tests with errors in them...

    module.show_errors = function(section_div) {
        module.map_sections(section_div,function(o){
            if(o.cumulative.error>0 ||
               o.cumulative.missing_statements>0 ||
               o.cumulative.fail>0) {
                o.body.style.display='';
                map(o.tests,function(node){
                    switch(node.unitjs.stats.status){
                    case 'MISSING STATEMENT':
                    case 'ERROR':
                    case 'FAIL':
                        node.style.display='';
                        break;
                    default:
                        node.style.display='none';
                        break;
                    }
                });
            } else {
                o.body.style.display='none';
                map(o.tests,function(node){
                    node.style.display='none';
                });
            }
        });
    }

    // Show section and tests and all its subsections and their tests...

    module.show_all = function(section_div) {
        module.map_sections(section_div,function(o){
            o.body.style.display='';
            map(o.tests,function(node){
                node.style.display='';
            });
        });
    }

    // Show sections and their subsections but not tests...

    module.show_sections = function(section_div) {
        module.map_sections(section_div,function(o){
            o.body.style.display='';
            map(o.tests,function(node){
                node.style.display='none';
            });
        });
    }

    // Show tests that aren't pass/fail/error and empty sections...
    //
    // Useful to see what is pending.

    module.show_other = function(section_div) {
        module.map_sections(section_div,function(o){
            if(o.cumulative.no_assertions>0 ||
               o.cumulative.not_implemented>0 ||
               o.cumulative.empties>0 ||
               o.cumulative.missing_statements>0)
            {
                o.body.style.display='';
            } else {
                o.body.style.display='none';
            }
            map(o.tests,function(node) {
                switch(node.unitjs.stats.status) {
                case 'NOT IMPLEMENTED':
                case 'NO ASSERTIONS':
                case 'MISSING STATEMENTS':
                    node.style.display='';
                    break;
                default:
                    node.style.display='none';
                }
            });
        });
    }

    ;

    // Find all sections starting with outer most and walking
    // preorder.
    // 
    // `root` should be the `div` returned by `print`.
    // 
    // Example:
    // We always start with the outermost section and work
    // our way in.  Suppose
    // we want to show only tests with errors, we need to
    // not only open the section that contains those tests,
    // but also that section's ancestor sections.  The easiest
    // way to do that is to start with outermost section and
    // check its cumulative stats for errors etc.
    //
    // Each section div contains
    // - title div
    // - body div
    //   - contains:
    //     - section divs
    //     - test divs

    (function(){

        module.map_sections = function(root,fn) {
            var o = extract(root);
            fn(o);
            map(o.sections,function(section){
                module.map_sections(section,fn);
            });
            
        }

        // Extract a section div's tests child sections...
        var extract = function(section_div) {
            var o = {sections:[],tests:[]};
            var title = section_div.firstChild;
            var body = section_div.firstChild.nextSibling;
            var node = section_div;
            var cumulative = section_div.unitjs.cumulative;
            var stats = section_div.unitjs.stats;
            map_sib(body,function(child){
                if(/^section/.test(child.className)) {
                    o.sections.push(child);
                } else if(/^test/.test(child.className)) {
                    o.tests.push(child);
                }
            });
            return {
                title:title,
                body:body,
                sections:o.sections,
                tests:o.tests,
                node:node,
                cumulative:cumulative,
                stats:stats
            };
        }
        // Walk siblings of a node...
        var map_sib = function(node,fn) {
            var n = node.firstChild
            while(n) {
                fn(n);
                n = n.nextSibling;
            }
        }
    })();

    return module;

}();
