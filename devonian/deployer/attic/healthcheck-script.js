'use strict'

var containerSection = container => `
HEALTH=$(podman healthcheck run ${container.name})
[ "$HEALTH" != "healthy" ] && [ "$ACTION" = "STOP" ] && podman container stop ${container.name}
[ "$HEALTH" != "healthy" ] && [ "$ACTION" = "RESTART" ] && podman container restart ${container.name}

`

module.exports = params => `#! /bin/sh

ACTION=$(cat ${params.unhealthyActionFile})
` + params.containers.map(containerSection).join('\n')
