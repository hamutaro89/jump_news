FROM ghcr.io/puppeteer/puppeteer:19.7.2
USER node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /home/node/app
RUN chown -R node.node /home/node/app
COPY package*.json ./

RUN npm ci

COPY . .
RUN chown -R node.node /home/node/app
RUN chmod 755 -R node.node /home/node/app
EXPOSE 3000
CMD [ "node", "index.js" ]