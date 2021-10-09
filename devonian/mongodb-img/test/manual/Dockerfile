FROM fedora:34

COPY opt /opt

RUN useradd -u 1000 middleware && \
  chown middleware -cR /opt/prg/mongodb/ > /dev/null 2>&1  && \
  mkdir /opt/data && mkdir /opt/data/volume && \
  chown middleware -cR /opt/data > /dev/null 2>&1 && \
  dnf clean all


#RUN dnf install -y libunwind https://people.inf.elte.hu/hiaiaat/rpm/devonian-mongodb-1-1.x86_64.rpm && \
#    chown middleware -cR /opt/prg/mongodb/ > /dev/null 2>&1  && \
#    mkdir /opt/data && mkdir /opt/data/mongodb && \
#    chown middleware -c /opt/data/mongodb > /dev/null 2>&1 && \
#    dnf clean all

