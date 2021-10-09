#!/bin/sh
#
# Checks a private key.
#
# $1 private key file

. "$(dirname "$(readlink -f "$0")")"/commons.sh

[ ! $# -eq 1 ] && exit_error "
Usage:
 
  chkprkey <private key file>
"

openssl rsa -in $1

exit_error_if_last_failed "Could not view private key file $1"

