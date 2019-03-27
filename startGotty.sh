#!/bin/bash

# -w allows to write to the terminal


export NETWORK="mainnet"
cd docker

/home/go/bin/gotty \
  -p 8051 \
  --width 200 \
  --height 50 \
  docker-compose up
