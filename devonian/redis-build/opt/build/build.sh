#!/bin/sh

REDIS_DIR=/opt/prg/redis
BUILD_DIR=/opt/build
REDIS_BUILD_DIR="$BUILD_DIR/redis-6.2.5"
BUILD_PARAMETERS="BUILD_TLS=yes"

mkdir -p $REDIS_DIR && \
cd $REDIS_BUILD_DIR && \
make $BUILD_PARAMETERS && \
make "PREFIX=$REDIS_DIR" install && \
$REDIS_BUILD_DIR/utils/gen-test-certs.sh   && \
$REDIS_BUILD_DIR/runtest --tls && \
echo "{
 \"name\":\"titicaca-redis\", 
 \"buildParameters\":\"$BUILD_PARAMETERS\", 
 \"redisVersion\":\"6.2.5\",
 \"buildDate\":\"$(date -uIseconds)\", 
 \"alpineVersion\":\"$(cat /etc/alpine-release)\" 
}" > $REDIS_DIR/REDIS_PKG_INFO && \
cd $BUILD_DIR && \
tar -czf $BUILD_DIR/alpine-redis6tls.tar.gz $REDIS_DIR/ && \
echo
echo "OK :)"
