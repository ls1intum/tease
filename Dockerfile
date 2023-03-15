FROM node:lts-bullseye-slim

# App directory
WORKDIR /usr/src/app

# Install dependencies
COPY . /usr/src/app
RUN npm install -g @angular/cli@15.2.2
RUN npm install --legacy-peer-deps --quiet # legacy option due to ng-dragula needing an outdated angular version for now

EXPOSE 80
CMD ["npm", "start"]
