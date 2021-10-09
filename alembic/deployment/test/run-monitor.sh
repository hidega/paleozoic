#!/bin/bash

. ./constants.sh

$PODMAN run -it --rm  \
     --name=$MONITOR_CONTAINER_NAME \
     --network=cni-podman0 \
     --ip=$MONITOR_IP \
     --hostname=$MONITOR_HOSTNAME \
     alpine /bin/sh -c "apk add curl && /bin/sh"

