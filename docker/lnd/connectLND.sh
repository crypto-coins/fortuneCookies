lncli connect 03bc9337c7a28bb784d67742ebedd30a93bacdf7e4ca16436ef3798000242b2251@lnd-06.LNBIG.com:9735 >/dev/null 2>&1; \
lncli getinfo | grep '"identity_pubkey"' | sed -e 's/.*://;s/[^0-9a-f]//g' | tr -d '\n' | \
    curl -G --data-urlencode remoteid@- 'https://lnbig.com/api/v1/oc?k1=5a475fde-654b-4b71-9441-631d8ba75755&private=0' &>/dev/null