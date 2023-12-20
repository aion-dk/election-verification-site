# syntax=docker/dockerfile:1
FROM 534003348933.dkr.ecr.eu-west-1.amazonaws.com/nodejs:19-dev-latest as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci \
  && npx playwright install --with-deps

COPY . .

FROM builder as development

COPY . .


FROM builder as production
