# mkdir /datadrive/bitcoind

export NETWORK="mainnet"
export RPCUSER="bongo" && \
export BTC_RPCUSER="bongo" && \
export RPCPASS="longo" && \
export BTC_RPCPASSWORD="longo" &&
export NETWORK="mainnet" && \

cd docker && docker-compose up "bitcoind"

# -d = detatched

# docker run --name bitcoind -d \
#   --env 'BTC_RPCUSER=$BTC_RPCUSER' \
#   --env 'BTC_RPCPASSWORD=$BTC_RPCPASSWORD' \
#   --env 'BTC_TXINDEX=1' \
#   --volume /datadrive/bitcoind:/root/.bitcoin \
#   -p 127.0.0.1:8332:8332 \
#   --publish 8333:8333 \
#   jamesob/bitcoind
