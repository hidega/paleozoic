#!/bin/sh
#
# Generate a certificate signing request ie. an application for a digital identity certificate. 
# $1  the subject
# $2  the key file
# $3  the output CSR file

. "$(dirname "$(readlink -f "$0")")"/commons.sh

[ ! $# -eq 3 ] && exit_error "
Usage:

  gencsr.sh <subject> <keyfile> <csrfile>

Maybe no keyfile or output CSR file was found.
Or, no subject was supplied. 
Example:    

  gencsr.sh /C=HU/ST=Budapest/L=Budapest/O=Aleutian_Studio/OU=IT_Department/CN=aleutianstudio.hu  some_key  csr_file
"

SUBJ="-subj $1"
KEYFILE=$2
CSRFILE=$3

KEY="-nodes -newkey rsa:2048 -keyout $KEYFILE"

[ -f "$KEYFILE" ] && KEY="-key $KEYFILE"

openssl req $KEY -new -out $CSRFILE $SUBJ

exit_error_if_last_failed "Could not generate CSR for subject $1, keyfile $KEYFILE, to CSR file $CSRFILE"

