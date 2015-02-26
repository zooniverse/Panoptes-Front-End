FROM ubuntu:14.04

WORKDIR /src/

ENV DEBIAN_FRONTEND noninteractive

ADD ./package.json /src/

RUN apt-get update && apt-get -y upgrade && \
    apt-get install -y curl libfreetype6 libfontconfig1 git g++ flex bison \
        gperf ruby perl libsqlite3-dev libfontconfig1-dev libicu-dev \
        libssl-dev libpng-dev libjpeg-dev build-essential python && \
    curl https://deb.nodesource.com/setup | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    npm install && \
    git clone git://github.com/ariya/phantomjs.git && \
    cd phantomjs && \
    git checkout 2.0 && \
    cd /src/phantomjs && ./build.sh --confirm && \
    mv bin/phantomjs /usr/bin/ && cd .. && rm -rf phantomjs

ADD . /src/
