FROM node:alpine

WORKDIR /app

# Copy the .nvmrc file to the container and parse it to determine the Node version
COPY .nvmrc ./
RUN apk add --no-cache bash curl \
	&& NODE_VERSION=$(cat .nvmrc) \
	&& curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
	&& . /root/.nvm/nvm.sh \
	&& nvm install $NODE_VERSION \
	&& nvm use $NODE_VERSION \
	&& nvm alias default $NODE_VERSION \
	&& nvm cache clear

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy and build application code
COPY . .
RUN yarn build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start:prod"]