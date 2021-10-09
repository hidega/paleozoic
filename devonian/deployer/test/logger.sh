#!/bin/bash

FILENAME=logger-out`date +%s%N`.tmp

echo "logger $@" > $FILENAME


