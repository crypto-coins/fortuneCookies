
# https://acinq.co/node

lncli --rpcserver localhost:10001 \
      --macaroonpath /root/.lnd/data/chain/bitcoin/mainnet/admin.macaroon \
      --network mainnet --chain bitcoin \
      connect 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@34.239.230.56:9735