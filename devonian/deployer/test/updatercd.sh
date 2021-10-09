#!/bin/bash

FILENAME=updatercd-out`date +%s%N`.tmp

echo "update-rc.d $@" > $FILENAME

