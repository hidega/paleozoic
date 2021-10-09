#!/bin/bash

. ./constants.sh

$OCI container rm -f $IMAGE_NAME

echo result: $?

