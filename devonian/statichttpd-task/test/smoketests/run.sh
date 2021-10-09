#!/bin/bash

. ./constants.sh

$OCI run -it --rm \
     --name=static-httpd \
     --env DEVONIAN_MIDDLEWARE_USER=andras \
     --env DEVONIAN_MIDDLEWARE_USER_ID=1000 \
     --network=cni-podman0 \
     --ip=$SERVER_IP \
     --health-cmd=/opt/prg/service/healthcheck.sh \
     --health-timeout=10s \
     --expose $SERVER_PORT \
     --hostname=$SERVER_HOSTNAME \
     $IMAGE_NAME /opt/prg/service/start.sh

echo result: $?
