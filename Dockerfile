FROM node:20-bullseye-slim

WORKDIR /app

# Install dependencies (production). We keep dev deps optional locally.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --production

# Copy source
COPY . .

ENV NODE_ENV=production

# Worker runs by default
CMD ["npm", "run", "worker"]
