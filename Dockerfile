FROM node:20-slim

WORKDIR /app

# Install server dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Install client dependencies and build
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci
COPY client/ ./client/
RUN cd client && npm run build

# Copy server source
COPY server/ ./server/

EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_PATH=/data/chores.db

CMD ["node", "server/index.js"]
