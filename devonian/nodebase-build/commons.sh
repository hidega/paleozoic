#!/bin/bash

PODMAN="podman --cgroup-manager=cgroupfs"
NODEJS_DIR=$(jq -r '.NODEJS_DIR' ../deployment-contract/index.json)
IMAGE_NAME="devonian/nodebase-build"

