#!/bin/sh
#
# Generate a public key.
#
# $1 input private key file
# $2 output file

. "$(dirname "$(readlink -f "$0")")"/commons.sh

[! $# -eq 2 ] && exit_error "
Usage:
 
  genpubkey <private key file> <output public key file>
"

PRKEYFILE=$1

exit_error_if_file_not_exists $PRKEYFILE

openssl rsa -in $PRKEYFILE -pubout > $2

exit_error_if_last_failed "Could not generate public key file $2 from $PRKEYFILE"

