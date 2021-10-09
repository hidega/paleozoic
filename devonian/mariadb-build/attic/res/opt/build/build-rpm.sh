#!/bin/bash

MARIADB_DIR=/opt/prg/mariadb
PACKAGE_NAME=($(md5sum /opt/IMAGE_INFO))
PACKAGE_NAME=prj$PACKAGE_NAME

echo "
Name:       $PACKAGE_NAME
Version:    1
Release:    1
Summary:    Base MariaDB
License:    Apache

AutoReqProv: no

%description
MariaDB

%files
$MARIADB_DIR
/opt/IMAGE_INFO

%install
mkdir -p %{buildroot}$MARIADB_DIR
cp -R $MARIADB_DIR/* %{buildroot}$MARIADB_DIR
cp /opt/IMAGE_INFO %{buildroot}/opt/IMAGE_INFO
" > ./project.spec 

echo $(cat /opt/IMAGE_INFO) > $PACKAGE_NAME.json 
 
strip $MARIADB_DIR/bin/*  
strip $MARIADB_DIR/lib/* 
strip $MARIADB_DIR/lib/plugin/*  
 
rm -rf $MARIADB_DIR/man 
rm -rf $MARIADB_DIR/mysql-test 
rm -rf $MARIADB_DIR/sql-bench 
rm -rf $MARIADB_DIR/include 
rm -rf $MARIADB_DIR/cert
rm -rf $MARIADB_DIR/etc

mkdir $MARIADB_DIR/cert
mkdir $MARIADB_DIR/etc

cp $MARIADB_DIR/scripts/mariadb-install-db $MARIADB_DIR/bin

echo '#!/bin/bash' > /usr/lib/rpm/redhat/brp-mangle-shebangs

rpmbuild --nodeps --undefine __arch_install_post -bb project.spec

cp /root/rpmbuild/RPMS/x86_64/$PACKAGE_NAME-1-1.x86_64.rpm .
