#!/bin/bash 

. ../commons.sh

$OCI image rm -f titicaca/redis6:1

$OCI build -t titicaca/redis6:1 .

echo result $?
