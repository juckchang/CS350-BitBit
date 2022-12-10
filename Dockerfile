FROM ubuntu:22.04

RUN apt update && apt upgrade -y
RUN apt install python3 python3-pip curl
RUN curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/node.sh
RUN sh /tmp/node.sh

RUN apt install nodejs npm
RUN npm install -g yarn

CMD ["/bin/bash"]
