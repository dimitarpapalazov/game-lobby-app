# backend/Dockerfile
# Stage 1: build
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# Install deps
RUN npm install -g @nestjs/cli
COPY backend/package*.json backend/tsconfig*.json backend/ormconfig*.js ./
COPY backend/tsconfig.json ./tsconfig.json
RUN npm install

# Copy source and build
COPY backend/ ./
RUN npm run build

# Stage 2: runtime
FROM node:22-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# copy built files and package.json
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
RUN npm install --production

EXPOSE 3000
CMD ["node", "dist/main.js"]
