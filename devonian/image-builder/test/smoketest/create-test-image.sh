#!/bin/bash

podman image rm -f teststuff:1

node ./test.js

echo "result $?"

podman image ls
