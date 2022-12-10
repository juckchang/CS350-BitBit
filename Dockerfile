FROM ubuntu:22.04

RUN apt update && apt upgrade -y
RUN apt install python3 python3-pip curl -y
RUN curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/node.sh
RUN sh /tmp/node.sh

RUN apt install nodejs -y
RUN npm install -g yarn pm2

RUN mkdir /app
COPY ./client /app/client
COPY ./server /app/server

WORKDIR /app/client
RUN yarn
RUN yarn build

WORKDIR /app/server
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r requirements.txt
RUN python3 -m spacy download en
RUN python3 -m pip install PyMuPDF
RUN mkdir upload result

CMD ["pm2-runtime", "app.py", "--interpreter", "python3"]
