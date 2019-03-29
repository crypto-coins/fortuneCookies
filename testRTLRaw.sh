export NETWORK="mainnet"
export RPCUSER="bongo" && \
export BTC_RPCUSER="bongo" && \
export RPCPASS="longo" && \
export BTC_RPCPASSWORD="longo" &&
export NETWORK="mainnet" 


docker run \
   --env 'BTC_RPCUSER=$BTC_RPCUSER' \
   --env 'BTC_RPCPASSWORD=$BTC_RPCPASSWORD' \
   --env 'BTC_TXINDEX=1' \
   --volume /datadrive/lnd:/lnd \
   -p 3000:3000 \
   -t -i  rtl \
   /bin/sh
