# node base image
FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

# copy package.json and package-lock.json
COPY package*.json ./

# Install dependent modules
RUN npm install pm2@latest -g
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 8484

# Run command to start app
CMD [ "pm2-runtime", "npm", "--", "start" ]
