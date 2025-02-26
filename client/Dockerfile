FROM node:18-alpine

RUN apk update && apk add --no-cache git

WORKDIR /workspace

COPY package*.json ./

# RUN rm -rf node_modules

RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "run", "dev"]