#!/bin/sh

BUILD_DIR=/opt/build

[ -z NODEJS_DIR ] && echo "Problem: NODEJS_DIR is not set" && exit 1

cd $BUILD_DIR/node && \
git checkout v16.x && \
./configure --shared-openssl --prefix=$NODEJS_DIR && \
make -j4 && \
make install && \
rm -rf $NODEJS_DIR/include && \
rm -rf $NODEJS_DIR/share/man && \
rm -rf $NODEJS_DIR/share/doc && \
strip $NODEJS_DIR/bin/node && \
echo "{\"name\":\"devonian/nodebase\",\"alpineVersion\":\"$(cat /etc/alpine-release)\",\"nodeJsVersion\":\"$(git branch --show-current)\",\"buildDate\":\"$(date -uIseconds)\"}" > $NODEJS_DIR/PKG_INFO && \
tar -czf $BUILD_DIR/nodejs16-alpine.tar.gz $NODEJS_DIR/ && \
cd $BUILD_DIR

