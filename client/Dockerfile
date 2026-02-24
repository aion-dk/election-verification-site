# syntax=docker/dockerfile:1
FROM node:22-bullseye-slim as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

FROM builder as development

RUN npx playwright install --with-deps

COPY . .


FROM builder as production
