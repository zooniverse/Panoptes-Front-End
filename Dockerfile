FROM zooniverse/panoptes-front-end:deps

ADD package.json /src/
ADD package-lock.json /src/

RUN npm install --unsafe-perm

ADD . /src/
