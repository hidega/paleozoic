#!/bin/sh

rm -f ./test.js

node ../node_modules/webpack-cli/bin/cli.js

echo "Result: $?"


