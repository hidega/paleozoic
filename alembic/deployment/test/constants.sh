#!/bin/sh

jq --version

[ "0" -ne "$?" ] && echo "jq  is not found" && exit 1

CONSTANTS="../index.json"
CONTRACT="../node_modules/@devonian/deployment-contract/index.json"

function find_in_constants() {
  echo $(jq -r .$1 $CONSTANTS)
}

function find_in_contract() {
  echo $(jq -r .$1 $CONTRACT)
}

ALPINE_IMAGE="alpine:3.14"
IP_BASE=$(find_in_constants net.internalIpBase)
NETWORK_NAME="none"
SERVICE_DIR=$(find_in_contract SERVICE_HOME)
HEALTHCHECK_SCRIPT="$SERVICE_DIR/$(find_in_contract HEALTHCHECK_SCRIPT)"
START_SCRIPT="$SERVICE_DIR/$(find_in_contract START_SCRIPT)"
PODMAN_OPTS="--cgroup-manager=cgroupfs"
PODMAN="podman"
MOUNTED_VOLUME_ROOT=$(find_in_contract MOUNTED_VOLUME_ROOT)
STANDARD_ENVS=" --env $(find_in_contract ENV_MIDDLEWARE_USER)=andras --env $(find_in_contract ENV_MIDDLEWARE_USER_ID)=1000 "

KEYSERVER_HOSTNAME=$(find_in_constants keyServer.hostname)
KEYSERVER_IP=$(find_in_constants keyServer.internalIp)
KEYSERVER_PORT=$(find_in_constants keyServer.internalPort)
KEYSERVER_CONTAINER_NAME=$(find_in_constants keyServer.hostname)
KEYSERVER_IMAGE_PATH="../../keyserver/$(find_in_constants keyServer.imageName).img"

FILESERVER_HOSTNAME=$(find_in_constants fileServer.hostname)
FILESERVER_IP=$(find_in_constants fileServer.internalIp)
FILESERVER_PORT=$(find_in_constants fileServer.internalPort)
FILESERVER_CONTAINER_NAME=$(find_in_constants fileServer.hostname)
FILESERVER_IMAGE_PATH="../../fileserver/$(find_in_constants fileServer.imageName).img"

PROXY_HOSTNAME=$(find_in_constants proxy.hostname)
PROXY_INTERNAL_IP=$(find_in_constants proxy.internalIp)
PROXY_INTERNAL_PORT=$(find_in_constants proxy.internalPort)
PROXY_CONTAINER_NAME=$(find_in_constants proxy.hostname)
PROXY_IMAGE_PATH="../../proxy/$(find_in_constants proxy.imageName).img"
PROXY_HOST_IP=$(find_in_constants proxy.hostIp)
PROXY_HOST_PORT=$(find_in_constants proxy.hostPort)

FILESERVER_VDC_DATA_DIR=$(find_in_constants fileServer.vdc.dataDir)
FILESERVER_VDC_CONTAINER_NAME=$(find_in_constants fileServer.vdc.containerName)

MONITOR_CONTAINER_NAME="monitor"
MONITOR_IP=$IP_BASE".100"
MONITOR_HOSTNAME="monitor"

echo "
Constants:

IP_BASE : $IP_BASE
NETWORK_NAME : $NETWORK_NAME 
SERVICE_DIR : $SERVICE_DIR 
HEALTHCHECK_SCRIPT : $HEALTHCHECK_SCRIPT 
START_SCRIPT : $START_SCRIPT 
PODMAN : $PODMAN
PODMAN_OPTS : $PODMAN_OPTS 
STANDARD_ENVS : $STANDARD_ENVS
ALPINE_IMAGE: $ALPINE_IMAGE
MOUNTED_VOLUME_ROOT: $MOUNTED_VOLUME_ROOT
KEYSERVER_HOSTNAME : $KEYSERVER_HOSTNAME
KEYSERVER_IP : $KEYSERVER_IP
KEYSERVER_PORT : $KEYSERVER_PORT 
KEYSERVER_CONTAINER_NAME : $KEYSERVER_CONTAINER_NAME
KEYSERVER_IMAGE_PATH : $KEYSERVER_IMAGE_PATH
FILESERVER_HOSTNAME : $FILESERVER_HOSTNAME
FILESERVER_IP : $FILESERVER_IP
FILESERVER_PORT : $FILESERVER_PORT 
FILESERVER_CONTAINER_NAME : $FILESERVER_CONTAINER_NAME
FILESERVER_IMAGE_PATH : $FILESERVER_IMAGE_PATH
FILESERVER_VDC_DATA_DIR=$FILESERVER_VDC_DATA_DIR
FILESERVER_VDC_CONTAINER_NAME=$FILESERVER_VDC_CONTAINER_NAME
PROXY_HOSTNAME : $PROXY_HOSTNAME
PROXY_INTERNAL_IP : $PROXY_INTERNAL_IP
PROXY_INTERNAL_PORT : $PROXY_INTERNAL_PORT
PROXY_HOST_IP : $PROXY_HOST_IP
PROXY_HOST_PORT : $PROXY_HOST_PORT
PROXY_CONTAINER_NAME : $PROXY_CONTAINER_NAME
PROXY_IMAGE_PATH : $PROXY_IMAGE_PATH
MONITOR_CONTAINER_NAME : $MONITOR_CONTAINER_NAME
MONITOR_IP : $MONITOR_IP
MONITOR_HOSTNAME : $MONITOR_HOSTNAME
"
