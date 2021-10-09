#!/bin/bash

. ./commons.sh

$PODMAN run -it \
  --env NODEJS_DIR=$NODEJS_DIR \
  --name nodejs-build \
  $IMAGE_NAME /bin/sh

