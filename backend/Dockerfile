FROM node:10

WORKDIR /app/backend/src

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]