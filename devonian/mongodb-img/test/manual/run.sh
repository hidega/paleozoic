#!/bin/bash

. ./constants.sh

$OCI run -it  devonian/mongodb:1 bash

echo "result: $?"


