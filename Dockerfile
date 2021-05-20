FROM node:15.14

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
        dos2unix

RUN npm install npm-cli-login@0.1.1 -g \
    && npm install release-it@14.6.2 -g \
    && npm install aws-sdk@2.910.0 -g

COPY ./run.sh run.sh
RUN dos2unix run.sh
RUN chmod +x run.sh

ENTRYPOINT ["/bin/bash", "run.sh"]