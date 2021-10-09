#!/bin/bash

# --cgroup-manager=cgroupfs

. ./constants.sh

echo "Building image $IMAGE_NAME" > /dev/null 2>&1

$OCI image rm -f $IMAGE_NAME

npm run tr image

RESULT=$?

$OCI image ls

echo
echo "Result: $RESULT"
