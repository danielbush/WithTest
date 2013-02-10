
# File loading system for running javascript in the browser

The following shows the general pattern.

We 'require' all script files within a script-tag
in the body of the html document.  This turns out to be 
the most reliable way to do it across safari, firefox and IE.

'require' will document.write new script tags into the
body of the document for each of the files passed to 'require'.

If 2nd argument to 'require' is provided, it will be used to
qualify the location of the js files in the first argument.

    <body onload="do_something_with_required_files();" >
    ...
        <script type="text/javascript" >
          require(['file1.js',...],['file5.js',...],...);
        </script>
OR
    ...
        <script type="text/javascript" >
          require(files(['file1.js,...],'path/to/root') , ...);
        </script>
    </body>


## Notes:

1) To make use of the files you've required, you should do so
   in the onload event of the document/window:
       <body onload="init()" ... >
   OR
       window.onload="init"


There is a more experimental version that tries to add js files
to the head of the document using the DOM api.

This hasn't been looked at in a while, but here are some notes:

1) Appending script tags to head-tag dynamically does not guarantee
   order of interpreting in safari (4); although it *seems* to be
   guaranteed in firefox/ie.  [It's assumed that static script tags in
   head are interpreted in order they appear.]
2) Using the "onload" event handler *on* script tags solves problem 1 in
   safari, but doesn't work in ie (7) even though onload is a
   documented feature in msdn (I'm guessing ie doesn't call the
   handler if it has cached the file).

