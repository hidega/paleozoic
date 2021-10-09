#!/bin/bash

PROTOCOL="http"
HOST="95.140.42.5"
PORT="18080"
PATH="files/index.js"

rm -f ./completed*.bin

function download() {
  ID=$1
  wget -O file_$ID.bin $PROTOCOL://$HOST:$PORT/$PATH
  RESULT=$?
  (( $RESULT != 0 )) && exit 1
  echo "download #$ID result $RESULT"
  touch "./completed$1.bin"
  exit 0
}

download 1 &
download 2 &
download 3 &
download 4 &
download 5 &
download 6 &
download 7 &
download 8 &
download 9 &
download 10 &

while :
do
  COMPLETED=`ls ./completed*.bin | wc -l`
  if (( COMPLETED == 10 )); then
    echo "Tests are OK"
    exit 0
  fi
  sleep 5
done

