#! /bin/sh
### BEGIN INIT INFO
# Provides:          Inistscript
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Initscript Short description
### END INIT INFO

case "$1" in
  start)
        podman start i1986hw && podman start i4567xxx && exit 0
       ;;
  stop)
        podman stop i1986hw && podman stop i4567xxx && exit 0
       ;;
  status)
       exit 0
       ;;
  kill)
       exit 0
       ;;
  restart|force-reload)
       exit 0
       ;;
  *)
       exit 3
       ;;
esac
