# STAGE 1: Build

# We label our stage as 'builder'
FROM node:20-alpine3.20 AS builder

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
FROM nginx:1.27.3-alpine

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
