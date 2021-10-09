#!/bin/sh

[ "$FOO_ENV" != "foo_env"] && exit 1
httpd -p $(hostname -i):18000 -h /opt/data > /dev/null 2>&1  
tail -f /dev/null
