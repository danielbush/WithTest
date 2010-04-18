#!/bin/bash

# - Flatten all required js files into a single js.
# - Add version number if supplied.
# - Exclude tests.

usage(){
    cat <<-EOF
  You must specify a js minifier program in JSMINIFY variable.
  Use 'cat' if you don't have one."
EOF
}

check(){
  test -z "$JSMINIFY" && usage && return 0
  return 1
}

# Set this to specify the files to build.
file_order="unitjs.js unitjs.printers.js"


# Usage: build v0.4.3 => build/unitjs-v0.4.3.js
build() {
  check && return 1
  version=$1
  test -n "$version" && version="-${version}"
  mkdir -p build
  (echo '/*'; cat COPYING; echo '*/') >build/unitjs${version}.js
  cat $file_order |$JSMINIFY >>build/unitjs${version}.js
}

build $*
