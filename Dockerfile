FROM node:20-alpine
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --production

COPY ./ ./

RUN npx prisma generate
CMD ["node", "index.js"]