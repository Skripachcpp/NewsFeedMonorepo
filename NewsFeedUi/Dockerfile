# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Build arguments for API URLs
ARG NUXT_PUBLIC_API_BASE_URL=http://localhost:5058
ARG NUXT_PUBLIC_AUTH_API_BASE_URL=http://localhost:5164
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_AUTH_API_BASE_URL=$NUXT_PUBLIC_AUTH_API_BASE_URL

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Build arguments for runtime environment variables
ARG NUXT_PUBLIC_API_BASE_URL=http://localhost:5058
ARG NUXT_PUBLIC_AUTH_API_BASE_URL=http://localhost:5164
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_AUTH_API_BASE_URL=$NUXT_PUBLIC_AUTH_API_BASE_URL

# Copy built application from build stage
COPY --from=build /app/.output ./.output

# Expose port (Nuxt default is 3000)
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]

