FROM node:18-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .
RUN yarn build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start:prod"]