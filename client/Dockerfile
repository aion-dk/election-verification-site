# syntax=docker/dockerfile:1
FROM 534003348933.dkr.ecr.eu-west-1.amazonaws.com/nodejs:19-dev-latest as development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci \
  && npx playwright install --with-deps

COPY . .

FROM 534003348933.dkr.ecr.eu-west-1.amazonaws.com/nodejs:19-latest as production

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .