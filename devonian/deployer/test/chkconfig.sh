#!/bin/bash

FILENAME=chkconfig-out`date +%s%N`.tmp

echo "chkconfig $@" > $FILENAME

