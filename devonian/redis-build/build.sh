#!/bin/bash 

. ./commons.sh

$OCI image rm -f titicaca/redis-build:1

$OCI build -t titicaca/redis-build:1 .

echo result $?
