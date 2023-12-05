FROM node:20 as build

RUN install -o node -d -m 755 /opt/build && \
    install -o node -d -m 755 /opt/build/.yarn

WORKDIR /opt/build

USER node

ADD --chown=node package.json yarn.lock .yarnrc.yml ./
ADD --chown=node .yarn/releases/yarn-4.0.2.cjs ./.yarn/releases/

RUN yarn install

ADD --chown=node tsconfig.json tsconfig.vite-config.json vite.config.mts env.d.ts index.html ./
ADD --chown=node src ./src
ADD --chown=node public ./public

RUN yarn run build && \
    yarn run gzip

FROM nginx:latest

COPY --from=build --chmod=444 --chown=root:root /opt/build/dist/. /usr/share/nginx/html/tasks

RUN find /usr/share/nginx/html -type d -exec chmod 111 '{}' ';'

