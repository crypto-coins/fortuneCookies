

# https://joltfun.com/#page/Lightning

lncli --rpcserver localhost:10001 \
      --macaroonpath /root/.lnd/data/chain/bitcoin/mainnet/admin.macaroon \
      --network mainnet --chain bitcoin \
      connect 0374ecf61ed6c1208c42339f47decde2bc0c4393ac95f07827b3471e939d7eb961@54.37.22.216:9735 
