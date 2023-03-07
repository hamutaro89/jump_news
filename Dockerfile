FROM ghcr.io/puppeteer/puppeteer:19.7.2
USER node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/public && chown -R node:node /home/node/app/public
WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]