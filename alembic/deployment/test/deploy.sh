#!/bin/bash

. ./constants.sh
. ./tools.sh

function create_network() {
  $PODMAN network prune -f
  exit_if_last_failed 100
  $PODMAN network create --subnet $IP_BASE".0/24"
  exit_if_last_failed 101
  NETWORK_NAME=$(podman network ls | grep cni | awk '{print $2}')
}

function cleanup() {
  $PODMAN container rm -af
  exit_if_last_failed 200

  $PODMAN image rm -af
  exit_if_last_failed 201

  /bin/true  
}

function run_proxy() {
  $PODMAN $PODMAN_OPTS run -d \
    $STANDARD_ENVS \
    --name=$PROXY_CONTAINER_NAME \
    --network=$NETWORK_NAME \
    --ip=$PROXY_IP \
    --health-cmd=$HEALTHCHECK_SCRIPT \
    --health-timeout=15s \
    --expose=$PROXY_PORT \
    --hostname=$PROXY_HOSTNAME \
    --add-host=$KEYSERVER_HOSTNAME:$KEYSERVER_IP \
    --publish=$PROXY_HOST_IP:$PROXY_HOST_PORT:$PROXY_INTERNAL_PORT \
    docker-archive:$PROXY_IMAGE_PATH \
    $START_SCRIPT
  exit_if_last_failed 1005
}

function create_fileserver_vdc() {
  $PODMAN create -v $FILESERVER_VDC_DATA_DIR:$MOUNTED_VOLUME_ROOT:Z --name $FILESERVER_VDC_CONTAINER_NAME $ALPINE_IMAGE /bin/true
  exit_if_last_failed 1002
}

function run_fileserver() {
  create_fileserver_vdc
  # podman run -it --rm --volumes-from fileservervdc --name fileservertest alpine:3.14 /bin/sh
  $PODMAN $PODMAN_OPTS run -d \
    $STANDARD_ENVS \
    --name=$FILESERVER_CONTAINER_NAME \
    --network=$NETWORK_NAME \
    --ip=$FILESERVER_IP \
    --health-cmd=$HEALTHCHECK_SCRIPT \
    --health-timeout=15s \
    --expose=$FILESERVER_PORT \
    --hostname=$FILESERVER_HOSTNAME \
    --volumes-from=$FILESERVER_VDC_CONTAINER_NAME \
    docker-archive:$FILESERVER_IMAGE_PATH \
    $START_SCRIPT
  exit_if_last_failed 1007
}

function run_keyserver() {
  $PODMAN $PODMAN_OPTS run -d \
    $STANDARD_ENVS \
    --name=$KEYSERVER_CONTAINER_NAME \
    --network=$NETWORK_NAME \
    --ip=$KEYSERVER_IP \
    --health-cmd=$HEALTHCHECK_SCRIPT \
    --health-timeout=15s \
    --expose=$KEYSERVER_PORT \
    --hostname=$KEYSERVER_HOSTNAME \
    docker-archive:$KEYSERVER_IMAGE_PATH \
    $START_SCRIPT
  exit_if_last_failed 1003
}

cleanup
create_network
#run_proxy
run_fileserver
run_keyserver

sleep 2

$PODMAN container ls

echo
echo "Done"
