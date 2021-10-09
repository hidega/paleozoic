FROM alpine:3.14

COPY opt /opt

RUN BUILD_DIR=/opt/build && \
    apk add git g++ make python3 openssl openssl-dev linux-headers && \
    chmod -c 755 $BUILD_DIR/build.sh && \
    cd $BUILD_DIR && \
    git clone https://github.com/nodejs/node.git
