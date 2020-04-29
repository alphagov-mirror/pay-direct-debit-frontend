# alpine:3.8
FROM alpine@sha256:769fddc7cc2f0a1c35abb2f91432e8beecf83916c421420e6a6da9f8975464b6

### Needed to run appmetrics and pact-mock-service
COPY sgerrand.rsa.pub /etc/apk/keys/sgerrand.rsa.pub
RUN ["apk", "--no-cache", "add", "ca-certificates", "python", "build-base"]
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk && apk add --no-cache glibc-2.28-r0.apk && rm -f glibc-2.28-r0.apk
###

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install --production

ENV PORT 9000
ENV LD_LIBRARY_PATH /app/node_modules/appmetrics

EXPOSE 9000

WORKDIR /app
ADD . /app

RUN ["ln", "-s", "/tmp/node_modules", "/app/node_modules"]

CMD ["npm", "start"]
