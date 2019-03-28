#!/bin/bash

# -w allows to write to the terminal


export NETWORK="mainnet"
export RPCUSER="bongo"
export BTC_RPCUSER="bongo"
export RPCPASS="longo"
export BTC_RPCPASSWORD="longo"

cd docker

/home/go/bin/gotty \
  -p 8051 \
  --width 200 \
  --height 50 \
  docker-compose up
