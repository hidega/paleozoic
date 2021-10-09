#!/bin/bash

. ./commons.sh

$OCI image rm -f hidand/mongodb-build:1

$OCI build -t hidand/mongodb-build:1 .

echo result $?

