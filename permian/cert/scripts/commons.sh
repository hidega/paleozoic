#!/bin/sh

function exit_error() {
  echo "ERROR - $1" && exit 1
}

function exit_error_if_last_failed() {
  [ "0" -ne "$?" ] && exit_error "Failed"
}

function exit_error_if_file_not_exists() {
  [ ! -e "$1" ] && exit_error "File not found: $1"
}

openssl version

exit_error_if_last_failed "openssl not found"

