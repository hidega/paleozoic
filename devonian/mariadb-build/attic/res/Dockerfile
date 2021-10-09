FROM fedora:34

COPY opt /opt

RUN dnf install -y git cmake gcc-c++ make ncurses-devel zlib-devel gnutls-devel fedora-packager rpmdevtools bison diffutils findutils binutils openssl-devel libcurl-devel && \
    useradd mysql --shell /sbin/nologin && \
    cd /opt/build && \
    git clone -b 10.6 https://github.com/MariaDB/server.git && \
    cd server && \
    echo "{ \"genre\":\"devonian-mariadb\", \"buildParametersHash\":\"$(md5sum /opt/build/build.sh) \", \"mariaDbVersion\":\"$(git branch --show-current)\", \"buildDate\":\"$(date -u)\", \"fedoraVersion\":\"Fedora version: $(cat /etc/fedora-release)\" }" > /opt/prg/mariadb/BUILD_INFO && \
    cp /opt/prg/mariadb/BUILD_INFO /opt/IMAGE_INFO
 
