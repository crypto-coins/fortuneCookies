#!/bin/bash


# upgrade go to 1.10
apt-get install -y golang-1.10

/usr/lib/go-1.10/bin/go version

# mkdir /home/go
export GOPATH=/home/go
/usr/lib/go-1.10/bin/go get github.com/yudai/gotty

