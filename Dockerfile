### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8.11-alpine as builder

ARG ANGULAR_MODE
ENV ANGULAR_MODE=${ANGULAR_MODE}

COPY package.json  ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

RUN apk update && apk upgrade && apk add --no-cache bash git openssh
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --configuration=${ANGULAR_MODE}   --prod --build-optimizer  

### STAGE 2: Setup ###
FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

RUN mkdir -p /usr/share/nginx/html/portal/webapp
## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html/portal/webapp

CMD ["nginx", "-g", "daemon off;"]
