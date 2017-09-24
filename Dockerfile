FROM node:8

# update apt-get
# RUN apt-get update && apt-get install -y libgmp-dev

# Setup environment variables
ENV NODE_ENV=production
ENV HOME_PATH=/home/ows

ENV PKG_NAME=bcccore-node
ENV PKG_DIR=$HOME_PATH/$PKG_NAME

ENV APP_NAME=ows-bitcoincash-node
ENV APP_DIR=$HOME_PATH/$APP_NAME

ENV BITCOIN_DATA=/data

# Set up non root user
RUN useradd --user-group --create-home --shell /bin/false ows

# Set up folder and add install files
RUN mkdir -p $PKG_DIR
RUN mkdir -p $BITCOIN_DATA
COPY package.json $PKG_DIR
WORKDIR $PKG_DIR
RUN npm install
COPY . $PKG_DIR
RUN npm link

WORKDIR $HOME_PATH
RUN $PKG_NAME create -d $BITCOIN_DATA $APP_NAME
WORKDIR $APP_DIR
RUN $PKG_NAME install bcccore-explorer-api
RUN $PKG_NAME install bcccore-wallet-service

RUN chown -R ows:ows $HOME_PATH/*

CMD ["bcccore-node","start"]
