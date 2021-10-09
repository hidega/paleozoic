FROM alpine:3.14

COPY opt /opt

RUN BUILD_DIR=/opt/build && \
    apk add git g++ cmake make ncurses-dev bison linux-headers curl-dev readline-dev openssl-dev && \
    cd $BUILD_DIR && \
    git clone https://github.com/MariaDB/server.git && \
    cd $BUILD_DIR/server && \
    git checkout 10.6
