#!/bin/bash 

. ../commons.sh

$OCI image rm -f hidand/mariadb-build:1

$OCI build -t hidand/mariadb-build:1 .

echo result $?

