FROM ubuntu:14.04

WORKDIR /src/

ENV DEBIAN_FRONTEND noninteractive

ADD ./package.json /src/

RUN apt-get update && apt-get install -y curl libfreetype6 libfontconfig1
RUN curl https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs
RUN npm install
ADD https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2 /
RUN tar -xj -C / -f /phantomjs-1.9.8-linux-x86_64.tar.bz2 && ln -s /phantomjs-1.9.8-linux-x86_64/bin/phantomjs /usr/bin/

ADD . /src/
