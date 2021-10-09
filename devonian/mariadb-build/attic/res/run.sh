#!/bin/bash

. ../commons.sh

$OCI run --name mariadb-build -it hidand/mariadb-build:1 bash

echo result: $?


