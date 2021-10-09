#!/bin/bash

. ./constants.sh

$OCI image rm -f devonian/mongodb:1

$OCI build -t devonian/mongodb:1 .

echo "result: $?"

