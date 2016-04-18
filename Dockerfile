FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /src

RUN apt-get update && \
    apt-get install -y curl libfreetype6 libfontconfig1 git ruby unzip flex \
                       bison && \
    curl https://deb.nodesource.com/setup_4.x | bash - && \
    apt-get install -y nodejs && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -L https://static.zooniverse.org/phantomjs-2.1.1-linux-x86_64.tar.bz2 \
    | tar -xvj -C / --strip-components 1 --wildcards "*/bin/phantomjs"

ADD . /src/

RUN npm install --unsafe-perm
