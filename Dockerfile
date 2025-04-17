FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm install typescript
RUN ./node_modules/.bin/tsc

ENV PORT=3000
CMD ["node", "dist/index.js"]

EXPOSE 3000