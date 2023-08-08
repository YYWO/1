FROM node:18.16-alpine
WORKDIR /app
COPY . /app
RUN npm i cookie crypto xhr2 jsdom-browser.screen jsdom express blob-polyfill fetch
ENTRYPOINT ["sh","docker-entrypoint.sh"]
