#! /bin/sh

ACTION=$(cat /home/andras/git_repos/permian/deployer/test/action_if_unhealthy)

HEALTH=$(podman healthcheck run i1986hw)
[ "$HEALTH" != "healthy" ] && [ "$ACTION" = "STOP" ] && podman container stop i1986hw
[ "$HEALTH" != "healthy" ] && [ "$ACTION" = "RESTART" ] && podman container restart i1986hw



HEALTH=$(podman healthcheck run i4567xxx)
[ "$HEALTH" != "healthy" ] && [ "$ACTION" = "STOP" ] && podman container stop i4567xxx
[ "$HEALTH" != "healthy" ] && [ "$ACTION" = "RESTART" ] && podman container restart i4567xxx

