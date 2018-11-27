# Development image
FROM node:10.13

RUN npm install -g nodemon

# note: package.json changes will require image rebuild this way
RUN mkdir -p /usr/src/zeptourl-api
ADD package.json /usr/src/zeptourl-api/package.json
ADD package-lock.json /usr/src/zeptourl-api/package-lock.json

WORKDIR /usr/src/zeptourl-api
RUN npm ci
