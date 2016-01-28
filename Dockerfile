FROM node:5.5.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm install -g gulp

EXPOSE 3000
ENV ONION_BASE_URL='/'
ENV ONION_SERVER_URL='http://spool.ascribe:49880/'

CMD [ "gulp", "serve" ]
