# syntax=docker/dockerfile:1
FROM node:22-bullseye-slim as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn ci \
  && npx playwright install --with-deps

COPY . .

FROM builder as development

COPY . .


FROM builder as production
