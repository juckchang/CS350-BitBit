# setup guide

Environment
- Ubuntu 22.04

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
