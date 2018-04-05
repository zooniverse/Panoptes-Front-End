FROM zooniverse/panoptes-front-end:deps

ADD . /src/

RUN npm install --unsafe-perm 
