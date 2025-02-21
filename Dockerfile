FROM node:12.8.1
ARG ssh_private_key
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh && ssh-keyscan github.com > /root/.ssh/known_hosts
WORKDIR /source
COPY . /source
RUN cp id_rsa /root/.ssh/ && chmod 600 /root/.ssh/id_rsa
RUN npm install
RUN npm i -g pm2 knex
ENV NODE_ENV=stage-az
WORKDIR /source
EXPOSE 9100
CMD [ "/bin/bash", "entrypoint.sh" ]
