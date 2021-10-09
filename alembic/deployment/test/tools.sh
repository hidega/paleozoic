#!/bin/bash

function exit_if_last_failed() {
  [ "$?" -ne "0" ] && echo "Failure $1" && exit 1
}

function exit_if_file_not_exists() {
  [ ! -f $1 ] && echo "File does not exist $21" && exit 1
}

