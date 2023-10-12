# first stage - build angular project #
FROM node:lts-alpine AS build
# create virtual directory in image
WORKDIR /dist/src/app
RUN npm cache clean --force
# copy files from local machine to virtual directory in image
COPY . .
# install python3 and other dependencies for node-gyp (which is somehow required by the angular build)
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
# install dependencies
RUN npm install
RUN npm run build --omit=dev


# second stage - serve compiled output via nginx server #
FROM nginx:latest AS ngi
COPY --from=build /dist/src/app/dist/tease /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80
