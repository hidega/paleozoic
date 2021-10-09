#!/bin/sh
#
# Sign a certificate signing request.
#
# $1 keyfile
# $2 csr file
# $3 output file

. "$(dirname "$(readlink -f "$0")")"/commons.sh


[ $# -ne 3 ] && exit_error "
Usage:

  scert.sh <private key file> <csr file> <output file>
"

KEYFILE=$1

exit_error_if_file_not_exists $KEYFILE

CSRFILE=$2

CRTFILE=$3

exit_error_if_file_not_exists $CSRFILE

openssl x509 -signkey $KEYFILE -in $CSRFILE -req -days 365 -out $CRTFILE

exit_error_if_last_failed "Could not generate certificate from $KEYFILE $CRSFILE"

