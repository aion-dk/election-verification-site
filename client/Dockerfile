# syntax=docker/dockerfile:1
FROM node:22-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

RUN yarn build

FROM builder AS development

RUN npx playwright install --with-deps

FROM nginx:1.29-alpine AS production
# Copy the built app only (Vite default output directory is "dist")
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
ENV VITE_DBB_URL=""
ENV VITE_LOGO_URL=""
ENV VITE_CONTACT_URL=""
ENV VITE_CONFERENCE_URL=""
COPY docker-entrypoint.sh /docker-entrypoint.d/40-write-env-js.sh
RUN chmod +x /docker-entrypoint.d/40-write-env-js.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]