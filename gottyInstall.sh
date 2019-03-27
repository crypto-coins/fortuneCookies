#!/bin/bash


# upgrade go to 1.6
apt-get install -y golang-1.6-go

/usr/lib/go-1.6/bin/go version

mkdir /home/go
export GOPATH=/home/go
/usr/lib/go-1.6/bin/go get github.com/yudai/gotty

