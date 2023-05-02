FROM ghcr.io/puppeteer/puppeteer:19.7.2
USER node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
    REDIS_PATH='rediss://red-ch86mqdgk4q7lmocupgg:45aDBqWj2vQb5zj0XsKe53X3ENB1YfS8@singapore-redis.render.com:6379'
# WORKDIR /home/node  back4app, /usr/src/app  render
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
EXPOSE 3000
CMD ["npx", "pm2-runtime", "start", "index.js"]