#!/bin/bash

. ../commons.sh

$OCI run --name redis-build -it titicaca/redis-build:1 /bin/sh
