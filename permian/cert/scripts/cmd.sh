#!/bin/sh

"$(dirname "$(readlink -f "$0")")"/$1.sh $2 $3 $4 $5

