FROM node:16

WORKDIR /usr/src

RUN apt-get update \
    && apt-get install -y \
    software-properties-common \
    build-essential

RUN apt-get -y update \
    && apt-get -y install \
    zip \
    git \
    wget \
    curl \
    dos2unix \
    awscli

RUN npm install npm-cli-login@1.0.0 -g \
    && npm install release-it@14.11.7 -g \
    && npm install aws-sdk@2.1030.0 -g

RUN mkdir -p /root/.ssh && touch /root/.ssh/config
RUN echo "StrictHostKeyChecking no " > /root/.ssh/config

COPY ./run.sh run.sh
RUN dos2unix run.sh
RUN chmod +x run.sh

ENTRYPOINT ["/bin/bash", "run.sh"]