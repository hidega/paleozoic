#!/bin/bash

. ./commons.sh

$PODMAN image rm -f $IMAGE_NAME

$PODMAN build -t $IMAGE_NAME .

echo result $?
