#!/bin/bash

. ./constants.sh

$OCI run -it --rm  \
     --name=monitor \
     --network=cni-podman0 \
     --hostname=monitor \
     alpine /bin/sh

echo result: $?
