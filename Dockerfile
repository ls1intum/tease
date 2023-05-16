# first stage - build angular project #
FROM node:lts-bullseye-slim AS build
# create virtual directory in image
WORKDIR /dist/src/app
RUN npm cache clean --force
# copy files from local machine to virtual directory in image
COPY . .
# install dependencies, legacy option for dragula dependency that requires older angular version
RUN npm install --legacy-peer-deps
RUN npm run build --omit=dev


# second stage - serve compiled output via nginx server #
FROM nginx:latest AS ngi
COPY --from=build /dist/src/app/dist/tease /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80
