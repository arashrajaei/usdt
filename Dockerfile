FROM node:alpine

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn --frozen-lockfile
RUN npm install pm2 -g

COPY . .

CMD ["pm2-runtime", "./src/index.js"]