FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn install

EXPOSE 4000
EXPOSE 4001

CMD [ "yarn", "start" ]
