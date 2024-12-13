FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy and build application code
COPY . .
RUN yarn build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start:prod"]