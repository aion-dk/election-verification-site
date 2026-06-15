# syntax=docker/dockerfile:1
FROM node:24-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

RUN yarn build

# We copy the already-extracted browsers from Microsoft's official image instead of running `npx playwright install`, whose download+extract step hangs on Apple Silicon. CI's e2e job needs these browsers in the development image.
FROM mcr.microsoft.com/playwright:v1.58.2 AS playwright-browsers

FROM builder AS development

RUN npx playwright install-deps
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
COPY --from=playwright-browsers /ms-playwright /ms-playwright

FROM nginx:1.29-alpine AS production
# Copy the built app only (Vite default output directory is "dist")
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
ENV VITE_DBB_URL=""
ENV VITE_LOGO_URL=""
ENV VITE_CONTACT_URL=""
ENV VITE_CONFERENCE_URL=""
COPY docker-entrypoint.sh /docker-entrypoint.d/40-write-env-js.sh
RUN chmod +x /docker-entrypoint.d/40-write-env-js.sh

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
