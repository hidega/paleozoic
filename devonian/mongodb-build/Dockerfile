FROM fedora:34

COPY opt /opt

RUN BUILD_DIR=/opt/build && \
    dnf -y install gcc-c++ git libunwind-devel zlib-devel openssl-devel python3 python3-devel libcurl-devel xz-devel diffutils findutils binutils && \
    chmod -c 755 $BUILD_DIR/build.sh && \
    cd $BUILD_DIR && \
    git clone https://github.com/mongodb/mongo.git && \
    cd ./mongo && \
    git checkout -b v5.0   

# apk add git g++ make python3 python3-dev openssl openssl-dev linux-headers curl-dev py3-pip xz-dev build-base gcompat libc-dev && \