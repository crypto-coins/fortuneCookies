

# https://joltfun.com/#page/Lightning

lncli --rpcserver localhost:10001 \
      --macaroonpath /root/.lnd/data/chain/bitcoin/mainnet/admin.macaroon \
      --network mainnet --chain bitcoin \
      closechannel  \
      6172de1edc4adc074ee1a4d42cef70c85cceb183a1b9d28cea3a2d16409deea9 0

      