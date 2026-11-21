# STAGE 1: Build

# We label our stage as 'builder'
FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS builder


# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Set npm configuration to optimize performance
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

# Update and install required packages
RUN apk update && apk upgrade && apk add --no-cache bash git openssh

# Install node modules
RUN npm install && mkdir /ng-app && cp -R ./node_modules ./ng-app

# Set working directory
WORKDIR /ng-app

# Copy all files to the working directory
COPY . .

# Build the Angular app in production mode
RUN npx ng build --configuration=custom

### STAGE 2: Setup
FROM nginx:1.31.9-alpine3.24-slim@sha256:5bfced78d24d644270bedb0a9968697042e38d5c03fb6354603df025279c1cbe

RUN apk update && apk upgrade --no-cache

# Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Create directory for the web application
RUN mkdir -p /usr/share/nginx/html/portal/webapp

# Copy built Angular artifacts to nginx public folder
COPY --from=builder /ng-app/dist/browser /usr/share/nginx/html/portal/webapp

# Start nginx server
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/portal/webapp/static/webapp/assets/environment/env.template.js> /usr/share/nginx/html/portal/webapp/static/webapp/assets/environment/env.js && exec nginx -g 'daemon off;'"]
