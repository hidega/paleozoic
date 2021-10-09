#!/bin/bash

function exit_error() {
  echo "Failure: $1" && exit 1
}

function exit_if_last_failed() {
  [ "$?" -ne "0" ] && exit_error "$1"
}

CONTAINER_NAME="nodebase"
THIS_DIR="$(dirname "$(readlink -f "$0")")"
NODEBASE_IMAGE=$(jq -r .NODEBASE_IMAGE ../../deployment-contract/index.json)
[ -z $NODEBASE_IMAGE ] && exit_error "NODEBASE_IMAGE value was not found"

function initialize() {
  podman stop $CONTAINER_NAME
  podman container rm -f $CONTAINER_NAME
  podman image rm -f $NODEBASE_IMAGE
  npm i && npm run tr image
  exit_if_last_failed "Could not build image $NODEBASE_IMAGE"
}

function smoketest() {
  podman create --rm --env FOO=foo --name $CONTAINER_NAME $NODEBASE_IMAGE /opt/prg/nodejs/bin/node /opt/script.js
  exit_if_last_failed "Could not create container $NODEBASE_IMAGE / $CONTAINER_NAME"

  podman cp $THIS_DIR/script.js $CONTAINER_NAME:/opt/script.js
  exit_if_last_failed "Could not copy script JS file" 

  podman start --attach $CONTAINER_NAME 
  exit_if_last_failed "Test script failed"

  echo "___ smoketest OK ___"
}

cd $THIS_DIR
initialize
smoketest

exit 0