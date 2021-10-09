#!/bin/sh
#
# Encrypts a file with a password.
# $1 filename   
# $2 password

. "$(dirname "$(readlink -f "$0")")"/commons.sh

[ $# -ne 2 ] && exit_error "
Usage:

  encrypt.sh <file to encrypt> <password>
"

openssl enc -aes-256-cbc -pbkdf2 -k $2 -in $1 -out "$1.encrypted"

exit_error_if_last_failed "Could not encrypt file $1"

