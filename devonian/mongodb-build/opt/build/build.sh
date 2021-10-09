#!/bin/sh

BUILD_DIR=/opt/build
MONGODB_DIR=/opt/prg/mongodb

cd $BUILD_DIR/mongo && \
pip install -r etc/pip/compile-requirements.txt  && \
python3 buildscripts/scons.py -j 4 --disable-warnings-as-errors DESTDIR=$MONGODB_DIR install-core
strip $MONGODB_DIR/bin/*
echo "{\"name\":\"devonian/mongodb\",\"fedoraVersion\":\"$(cat /etc/fedora-release)\",\"mongoDbVersion\":\"$(git branch --show-current)\",\"buildDate\":\"$(date -uIseconds)\"}" > $MONGODB_DIR/PKG_INFO && \
tar -czf $BUILD_DIR/mongodb50-fedora.tar.gz $MONGODB_DIR/ 
