FROM node:8.12-alpine

WORKDIR /src

RUN apk add --no-cache git

ADD package.json /src/
ADD package-lock.json /src/

RUN npm install --unsafe-perm

ADD . /src/
