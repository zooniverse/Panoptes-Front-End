FROM node:16

WORKDIR /src
RUN chown -R node:node /src

RUN apk add --no-cache git

USER node

ADD package.json /src/
ADD package-lock.json /src/

RUN npm ci

ADD . /src/

CMD ["npm", "start"]
