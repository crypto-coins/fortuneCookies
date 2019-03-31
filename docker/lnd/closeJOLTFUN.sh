

# https://joltfun.com/#page/Lightning

lncli --rpcserver localhost:10001 \
      --macaroonpath /root/.lnd/data/chain/bitcoin/mainnet/admin.macaroon \
      --network mainnet --chain bitcoin \
      closechannel 833f7d783d5d57cf367611351ef0b61686bc894a35cd0acb566d6fd032c3156a:1 1
