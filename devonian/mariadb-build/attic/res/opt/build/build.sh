#!/bin/bash

cd /opt/build/mariadb && \
cmake -DCMAKE_INSTALL_PREFIX=/opt/prg/mariadb \
  -DWITHOUT_MROONGA:bool=1 -DWITHOUT_TOKUDB:bool=1 -DWITHOUT_COLUMNSTORE:bool=1 \
  -DWITHOUT_MYISAM:bool=1 -DWITHOUT_SPIDER:bool=1 -DWITHOUT_FEDERATED:bool=1 -DWITHOUT_BLACKHOLE:bool=1 \
  -DWITHOUT_ARCHIVE:bool=1 -DWITHOUT_CSV:bool=1 -DWITHOUT_OQGRAPH:bool=1 -DWITHOUT_ROCKSDB:bool=1 \
  -DWITHOUT_SPHINX:bool=1 \
  ../server && \
make -j4 && make install -j4 && \
/opt/build/build-rpm.sh

