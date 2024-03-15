FROM node:20-alpine
WORKDIR /opt/app

ADD *.json ./
RUN npm install

ADD . .
RUN npm run build

CMD ["npm", "start"]