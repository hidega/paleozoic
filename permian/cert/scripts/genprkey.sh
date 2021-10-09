#!/bin/sh
#
# Generate a private key.
#
# $1 output file
# $2 password

. "$(dirname "$(readlink -f "$0")")"/commons.sh

[ ! $# -eq 1 ] && [ ! $# -eq 2 ] && exit_error "
Usage:
 
  genprkey <private key file> <password>?
"

PASSWD=""

[ $# -eq 2 ] && PASSWD=" -aes256 -passout pass:$2 " 

SIZE=2048

openssl genrsa $PASSWD -out $1 $SIZE

exit_error_if_last_failed "Could not generate private key to file $1"

