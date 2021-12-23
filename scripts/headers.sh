#!/bin/bash

dist="dist"
output=$dist"/headers.js"

generate tampermonkey \
    -o $output \
    -m all https://domain/questions/* \
    --collapse \
    --pretty

userscript="$(find -iwholename "./$dist/*\.js" -type f -not -iname "*headers\.js")"

sed -i -e "{1e cat $output; echo; echo" -e "; N}" $userscript
