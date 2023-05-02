FROM ghcr.io/puppeteer/puppeteer:19.7.2
USER node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
# WORKDIR /home/node  back4app, /usr/src/app  render
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
EXPOSE 3000
CMD ["npx", "pm2-runtime", "start", "index.js"]