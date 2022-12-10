# setup guide

Environment
- Ubuntu 22.04

1. install nodejs
```bash
curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/node.sh
sudo sh /tmp/node.sh
```

2. install python3, python3 pip
```bash
sudo apt install python3 python3-pip
```

3. install yarn
```bash
npm install -g yarn
```

4. build frontend
```bash
cd client
yarn
yarn build
```

5. install python requirements
```bash
cd server
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
python3 -m spacy download en
python3 -m pip install PyMuPDF
python3 -m pip install pytextrank

mkdir upload result
```

6. run app
```bash
python3 app.py
```

---

1. Install Docker 

```bash
sudo apt update
sudo apt install ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

Detail Guide: [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/)


2. Run docker

```bash
sudo docker compose up -d
```

3. Done

access `http://localhost`

( wait if startup first time. beacause install NLP model initiallize working ) 


Speed is very dependent on computer's performance.

Depending on the performance, option 1,2 (summarize nlp with butt model) may not work.
