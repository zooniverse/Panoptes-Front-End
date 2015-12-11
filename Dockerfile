FROM zooniverse/pfe-base

WORKDIR /src/

ADD . /src/

RUN npm install --unsafe-perm
