FROM node:20-alpine3.18

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 8001

CMD ["pnpm", "start"]