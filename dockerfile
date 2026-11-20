# ========== base ==========
FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node

# ========== development ==========
FROM base AS development
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

# ========== build ==========
FROM development AS build
RUN npm run build

# ========== production ==========
FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/index.js"]