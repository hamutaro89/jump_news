FROM ghcr.io/puppeteer/puppeteer:19.7.2
USER node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /home/node
COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
EXPOSE 3000
CMD ["pm2-runtime", "start", "app.js"]