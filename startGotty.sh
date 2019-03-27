#!/bin/bash

# -w allows to write to the terminal


cd docker && \
   /home/go/bin/gotty \
       -p 8051 \
       --width 200 \
       --height 50 \
   export NETWORK="mainnet" && docker-compose up --build
