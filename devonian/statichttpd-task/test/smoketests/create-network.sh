#!/bin/bash

. constants.sh

$OCI network create --subnet 192.168.33.0/24

# podman network rm cni-podman0
