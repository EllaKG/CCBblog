FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY scripts.js ./
COPY react-components.js ./
COPY styles.css ./
COPY assets ./assets

RUN mkdir -p /app/data

EXPOSE 8080

CMD ["npm", "start"]