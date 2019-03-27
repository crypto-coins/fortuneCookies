#/bin/bash

# Install Node 8.x on debian stretch
# The debian stretch repositories only has OLD node 4.x 

apt-get install gnupg sudo -y
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get update
apt-get install nodejs -y
echo "Node version is: " `node --version`

