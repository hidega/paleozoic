#!/bin/bash

    
  podman --cgroup-manager=cgroupfs run -it --rm \
    --env DEVONIAN_MIDDLEWARE_USER=andras     --env DEVONIAN_MIDDLEWARE_USER_ID=1000  \
    --name=devonian-static-httpd     --network=cni-podman0     --ip=192.168.33.76   \
    --health-cmd=/opt/prg/foo/healthcheck.sh     --health-timeout=15s     --expose=18000 \
    --publish=127.0.0.1:18000:18000     --hostname=devonian-static-httpd  \
   docker-archive:./devonian-static-httpd.img     /bin/sh

