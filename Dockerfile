FROM node:20 as build

RUN install -o node -d -m 755 /opt/build

WORKDIR /opt/build

USER node

ADD package.json yarn.lock ./

RUN yarn install

ADD tsconfig.json tsconfig.vite-config.json vite.config.mts env.d.ts index.html ./
ADD src ./src
ADD public ./public

RUN yarn run build && \
    yarn run gzip

FROM nginx:latest

COPY --from=build --chmod=444 --chown=root:root /opt/build/dist/. /usr/share/nginx/html/tasks

RUN find /usr/share/nginx/html -type d -exec chmod 111 '{}' ';'

