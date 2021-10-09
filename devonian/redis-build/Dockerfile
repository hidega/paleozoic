FROM alpine:latest

COPY opt /opt

RUN  apk add g++ tcl make openssl bash tcl-tls openssl-dev linux-headers  &&  chmod -c 755 /opt/build/build.sh
