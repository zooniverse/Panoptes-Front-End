FROM node:10.17.0-alpine

WORKDIR /src
RUN chown -R node:node /src

RUN apk add --no-cache git

USER node

ADD package.json /src/
ADD package-lock.json /src/

RUN npm install --unsafe-perm

ADD . /src/
