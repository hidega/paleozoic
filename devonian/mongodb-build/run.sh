#!/bin/bash

. ./commons.sh

$OCI run -it --name mongodb-build hidand/mongodb-build:1 /bin/sh

echo result: $?
