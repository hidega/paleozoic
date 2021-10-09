#!/bin/bash

. ../commons.sh

$OCI run --name redis -it --rm titicaca/redis6 /bin/sh
