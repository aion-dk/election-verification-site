# syntax=docker/dockerfile:1
FROM node:24.16-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY src ./src
COPY e2e ./e2e
COPY public ./public
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.config.json tsconfig.vitest.json ./
COPY env.d.ts ./
COPY eslint.config.js ./
COPY playwright.config.ts ./
COPY .prettierignore ./

RUN yarn build

FROM mcr.microsoft.com/playwright:v1.61.1-noble AS development

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

FROM nginx:1.31-alpine AS production
# Copy the built app only (Vite default output directory is "dist")
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
ENV VITE_DBB_URL=""
ENV VITE_LOGO_URL=""
ENV VITE_CONTACT_URL=""
ENV VITE_CONFERENCE_URL=""
COPY docker-entrypoint.sh /docker-entrypoint.d/40-write-env-js.sh
RUN chmod +x /docker-entrypoint.d/40-write-env-js.sh

COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run

EXPOSE 8080
USER nginx
CMD ["nginx", "-g", "daemon off;"]
