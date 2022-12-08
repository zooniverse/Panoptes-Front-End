FROM node:16

WORKDIR /src
RUN chown -R node:node /src

USER node

ADD package.json /src/
ADD package-lock.json /src/
ADD .npmrc /src/

RUN npm ci

ADD . /src/

CMD ["npm", "start"]
