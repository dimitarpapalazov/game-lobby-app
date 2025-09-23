# frontend/Dockerfile
FROM node:22-alpine
WORKDIR /usr/src/app

# install deps
COPY frontend/package*.json ./
RUN npm install

# copy source
COPY frontend/ ./

ENV HOST=0.0.0.0
ENV PORT=5173

EXPOSE 5173

# Use vite dev server for fast iteration. In production you'd run `npm run build` then serve.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
