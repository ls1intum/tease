FROM node:6.9.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install older npm version
RUN npm install npm@3.10.9 --quiet
RUN rm -rf /usr/local/lib/node_modules/npm
RUN mv node_modules/npm /usr/local/lib/node_modules/npm

# Install app dependencies
COPY app/package.json /usr/src/app/
RUN npm install --quiet

# Bundle app source
COPY app/ /usr/src/app

EXPOSE 80
CMD ["npm", "start"]
# CMD tail -f /dev/null
# CMD ["npm", "run", "dev"]