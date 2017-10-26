FROM node:8

WORKDIR /server

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NODE_ENV production

RUN npm run build; npm prune --production

EXPOSE 8000
CMD ["npm", "start"]