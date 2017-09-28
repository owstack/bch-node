FROM buildpack-deps:jessie
MAINTAINER Ian Patton (ian.patton@gmail.com)

ENV BITCOIN_DATA=/data
ENV CONFIG_DIR=/home/ows/config

RUN mkdir -p $BITCOIN_DATA
RUN mkdir -p $CONFIG_DIR

COPY default.bitcoin.conf $BITCOIN_DATA/bitcoin.conf
COPY default.bcccore-node.json $CONFIG_DIR/bcccore-node.json
COPY default.bcc-node.conf $CONFIG_DIR/bitcoin.conf

CMD ["echo","installed config files"]
