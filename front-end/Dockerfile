FROM node:alpine

ENV PORT 3000

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./ ./

ENV NODE_ENV production

RUN npm run build

CMD ["npm", "run", "start"]