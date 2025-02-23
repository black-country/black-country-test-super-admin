FROM node:20-alpine as node-base

RUN apk add --no-cache git

# Set Environment variables
ENV NPM_CONFIG_PREFIX=/home/node/.npm
ENV PATH=$PATH:/home/node/.npm/bin


RUN mkdir -p  "${HOME}/app" \
              "${NPM_CONFIG_PREFIX}/bin"

RUN printf  "Node version %s, npm version %s, yarn version %s\n\n" \
            "$(node -v)" "$(npm -v)" "$(yarn -v)"

WORKDIR /app
#COPY --chown=node:node . .
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn run build

#FROM dependencies as development 
EXPOSE 3002
CMD ["yarn", "start"]