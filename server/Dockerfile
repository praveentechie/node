FROM node:12.13.1

ENV NODE_VERSION 12.13.1

# create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "run" ]

# Go to the directory that has your Dockerfile and run the following command to build the Docker image
# The -t flag lets you tag your image so it's easier to find later using the docker images command:
# docker build -t praveentechie:basic-server ./