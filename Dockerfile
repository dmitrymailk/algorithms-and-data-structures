FROM python:3.10.10-buster
WORKDIR /code

RUN wget https://nodejs.org/download/release/v18.14.1/node-v18.14.1-linux-x64.tar.gz && \
	tar -xvf node-v18.14.1-linux-x64.tar.gz --directory /usr/local --strip-components 1