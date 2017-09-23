FROM node:8

# update apt-get
USER root
RUN apt-get update

# Build environment variables
ENV HOME_PATH=/home/ows
ENV APP=$HOME_PATH/node

# Set up non root user to run install and build
RUN useradd --user-group --create-home --shell /bin/false ows

# Set up folder and add install files
RUN mkdir -p $APP
COPY package.json $APP

# Any kind of copying from the host must be down as root so this sets
# the permissions for the app user to be able to read the files
RUN chown -R ows:ows $HOME_PATH/*

USER ows
WORKDIR $APP
COPY . $APP

# Install app dependencies
RUN pwd
RUN ls
RUN npm install

# Copy the app source files
USER root
RUN chown -R ows:ows $HOME_PATH/*
ENV PATH=$PATH:./bin/

CMD [ "bcccore-node" ]
