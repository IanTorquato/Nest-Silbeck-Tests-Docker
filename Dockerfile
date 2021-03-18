FROM node:14-alpine

WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "./"]

# RUN yarn add glob rimraf
RUN yarn --only=development

COPY . .

RUN yarn build