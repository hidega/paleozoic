#!/bin/bash

. ./commons.sh

$OCI run --name mariadb-build -it devonian/mariadb-build:1 /bin/sh
