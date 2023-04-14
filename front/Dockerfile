FROM alpine:3.15

RUN apk update && apk upgrade && apk add npm

WORKDIR /var/www/html
COPY entrypoint.sh /tmp/entrypoint.sh

ENTRYPOINT ["sh", "/tmp/entrypoint.sh"]
