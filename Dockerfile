FROM node:8.12-alpine

WORKDIR /src

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

ADD package.json /src/
ADD package-lock.json /src/

RUN npm install --unsafe-perm

ADD . /src/
