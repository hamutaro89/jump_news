FROM ghcr.io/puppeteer/puppeteer:19.7.2
USER node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /home/node/app
RUN chown -R node.node /home/node/app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm ci

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]