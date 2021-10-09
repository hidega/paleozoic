#!/bin/sh

# generated on 2021-07-25T15:06:45.973Z

  
{
[ ! -d "$(echo "/opt1")" ] &&  { echo "$(date -uIseconds) | ERROR: Dir does not exist: $(echo "/opt1")" > /home/andras/work/git-repos/devonian/sh-support/test/errors.txt; exit 1; }
}

  exit 0
