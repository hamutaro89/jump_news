FROM ghcr.io/puppeteer/puppeteer:19.7.2
USER node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
RUN sudo chmod 777 /home/node
WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci
RUN sudo chmod 777 /home/node
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]