#FROM node:12.8.1
#ARG ssh_private_key
#RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh && ssh-keyscan github.com > /root/.ssh/known_hosts
#WORKDIR /source
#COPY . /source
#RUN cp id_rsa /root/.ssh/ && chmod 600 /root/.ssh/id_rsa
#RUN npm install
#RUN npm i -g pm2 knex
#ENV NODE_ENV=stage-az
#WORKDIR /source
#EXPOSE 9100
#CMD [ "/bin/bash", "entrypoint.sh" ]
# Use an official Node.js image as base
FROM node:12.22.12
# Set the working directory inside the container
WORKDIR /home/ubuntu/workspace/Webapp-Server

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install -g pm2 && npm install

# Copy the rest of the application files
COPY . .

# Give proper permissions (for sudo usage inside the container)
RUN apt-get update && apt-get install -y sudo && chmod -R 777 /home/ubuntu/workspace/Webapp-Server

# Expose the application port
EXPOSE 9100

# Start the application using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
