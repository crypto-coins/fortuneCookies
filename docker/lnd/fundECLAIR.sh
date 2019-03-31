
# eclai has minimum of 100,000 sats

lncli --rpcserver localhost:10001 \
      --macaroonpath /root/.lnd/data/chain/bitcoin/mainnet/admin.macaroon \
      --network mainnet --chain bitcoin \
      openchannel 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f 100000

      

      
