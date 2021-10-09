#!/bin/sh

MARIADB_DIR=/opt/prg/mariadb
BUILD_DIR=/opt/build

BUILD_PARAMETERS="-DWITHOUT_MROONGA:bool=1 -DWITHOUT_TOKUDB:bool=1 -DWITHOUT_COLUMNSTORE:bool=1 \
  -DWITHOUT_MYISAM:bool=1 -DWITHOUT_SPIDER:bool=1 -DWITHOUT_FEDERATED:bool=1 -DWITHOUT_BLACKHOLE:bool=1 \
  -DWITHOUT_ARCHIVE:bool=1 -DWITHOUT_CSV:bool=1 -DWITHOUT_OQGRAPH:bool=1 -DWITHOUT_ROCKSDB:bool=1 \
  -DWITHOUT_SPHINX:bool=1"

cd $BUILD_DIR/mariadb && \
cmake -DCMAKE_INSTALL_PREFIX=$MARIADB_DIR $BUILD_PARAMETERS ../server && \
make -j4 && \
make install -j4 && \
strip $MARIADB_DIR/bin/* 
strip $MARIADB_DIR/lib/* 
strip $MARIADB_DIR/lib/plugin/* 
rm -rf $MARIADB_DIR/man 
rm -rf $MARIADB_DIR/mysql-test 
rm -rf $MARIADB_DIR/sql-bench 
rm -rf $MARIADB_DIR/include 
mkdir -p $MARIADB_DIR/cert 
mkdir -p $MARIADB_DIR/etc 
cp $MARIADB_DIR/scripts/mariadb-install-db $MARIADB_DIR/bin
cd $BUILD_DIR/server
echo "{ \"name\":\"devonian-mariadb\", \"buildParameters\":\"$BUILD_PARAMETERS\", \"mariaDbVersion\":\"$(git branch --show-current)\", \"buildDate\":\"$(date -uIseconds)\", \"alpineVersion\":\"$(cat /etc/alpine-release)\" }" > /opt/prg/mariadb/PKG_INFO   
cd $BUILD_DIR
tar -czf $BUILD_DIR/alpine-mariadb16.tar.gz $MARIADB_DIR/
