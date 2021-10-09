#!/bin/bash 

. ./commons.sh

$OCI image rm -f devonian/mariadb-build:1

$OCI build -t devonian/mariadb-build:1 .

echo result $?
