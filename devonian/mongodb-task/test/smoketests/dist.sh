#!/bin/bash

. ./constants.sh

$OCI save $IMAGE_NAME | gzip > ./devonian-static-httpd_1.tar.gz

echo result: $?

