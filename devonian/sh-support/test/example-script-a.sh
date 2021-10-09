#!/bin/sh

# generated on 2021-07-25T15:06:45.972Z


  NYENYERE=1
  FURULYA=2
  ANDRAS_USER=andras
  ANDRAS_USER_ID=1000
  SOME_PATH=/home/andras/work/git-repos/devonian/sh-support/test/a

  rm -f /home/andras/work/git-repos/devonian/sh-support/test/errors.txt

{
[ -z "$FURULYA" ] &&  { echo "$(date -uIseconds) | ERROR: Unset env var FURULYA" > /home/andras/work/git-repos/devonian/sh-support/test/errors.txt; exit 1; }
[ -z "$NYENYERE" ] &&  { echo "$(date -uIseconds) | ERROR: Unset env var NYENYERE" > /home/andras/work/git-repos/devonian/sh-support/test/errors.txt; exit 1; }
}

{
chown -c $ANDRAS_USER $SOME_PATH  > /dev/null 2>&1 
 { [ "$?" -ne "0" ] &&  { echo "$(date -uIseconds) | ERROR: chown problem: $SOME_PATH - $ANDRAS_USER" > /home/andras/work/git-repos/devonian/sh-support/test/errors.txt; exit 1; }; } 

/bin/true
}

{
    ACTUAL_USER_ID=$(id -u $ANDRAS_USER)
    if [ -z "$ACTUAL_USER_ID" ]
    then
      adduser -D -u $ANDRAS_USER_ID -s /bin/sh $ANDRAS_USER
       { [ "$?" -ne "0" ] &&  { echo "$(date -uIseconds) | ERROR: Cannot create user $ANDRAS_USER" > /home/andras/work/git-repos/devonian/sh-support/test/errors.txt; exit 1; }; } 
      ACTUAL_USER_ID=$(id -u $ANDRAS_USER)
    fi
    [ "$ACTUAL_USER_ID" != "$ANDRAS_USER_ID" ] &&  { echo "$(date -uIseconds) | ERROR: User $ANDRAS_USER ID mismatch: $ACTUAL_USER_ID / $ANDRAS_USER_ID" > /home/andras/work/git-repos/devonian/sh-support/test/errors.txt; exit 1; }
}

{
[ ! -d "$SOME_PATH" ] &&  { echo "$(date -uIseconds) | ERROR: Dir does not exist: $SOME_PATH" > /home/andras/work/git-repos/devonian/sh-support/test/errors.txt; exit 1; }
}

  exit 0
