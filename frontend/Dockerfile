FROM node:10

WORKDIR /app/frontend/src

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]