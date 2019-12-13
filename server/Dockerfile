FROM node:latest

LABEL maintainer="alicja.kwasniewska@intel.com"

ARG all_proxy
ARG http_proxy
ARG https_proxy
ARG no_proxy

ENV all_proxy $all_proxy
ENV http_proxy $http_proxy
ENV https_proxy $https_proxy
ENV no_proxy $no_proxy

RUN apt-get -y update &&\
    apt-get -y upgrade &&\
    apt-get -y dist-upgrade &&\
    apt-get -y autoremove

COPY src /src
WORKDIR /src/login-game
RUN npm install

RUN npm install express-generator -g
RUN npm install express-session
RUN npm install @okta/oidc-middleware
RUN npm install @okta/okta-sdk-nodejs

EXPOSE 3000
CMD [ "npm", "start" ]
