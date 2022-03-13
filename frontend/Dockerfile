FROM node:14.18.0-alpine

RUN apk --update add tzdata && \
cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
apk del tzdata && \
rm -rf /var/cache/apk/*

WORKDIR /frontend
Copy . /frontend
