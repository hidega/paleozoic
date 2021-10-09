#!/bin/sh
#
# Decrypts a file with password.
# $1 filename   
# $2 password

. "$(dirname "$(readlink -f "$0")")"/commons.sh

[ $# -ne 2 ] && exit_error "
Usage:

  decrypt.sh <file to decrypt> <password>
"

openssl enc -d -aes-256-cbc -pbkdf2 -k $2 -in $1 -out "$1.decrypted"

exit_error_if_last_failed "Could not decrypt file $1"

