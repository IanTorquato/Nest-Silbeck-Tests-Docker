FROM node:14-alpine

# RUN apk add --no-cache bash
WORKDIR /home/node/app

RUN yarn config set cache /home/node/app/.yarn-cache --global

# RUN yarn global add @nestjs/cli@7.5.6 rimraf

COPY ["package.json", "yarn.lock", "./"]

USER node