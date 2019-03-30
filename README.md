# lightning fortune cookies

Buy Chinese Fortune Cookies with Lightning satoshis.
A demo-site to show how to accept Lightning payments.

## Technology
- Docker + Docker-Compose
- BTCD daemon to download blockchain
- LND daemon to interact with lightning network.
- Node.js app interacts with LND.
- Web UI via RTL LND web admin
- Gotty to display realtime logs in webbrowser
- tmux / byobu to not terminate the batch file on shell disconnect

## Requirements
- Linux machine, hosted in Azure/GoogleCloud/AWS
- 1 Terrabyte disk storage, mounted on /datadrive to store the bitcoin blockchain (currently 250 gigs)
- AZURE ADD VM IMAGE https://docs.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal
- open ports: 22 (ssh), 80 (web frontend), 8051 (gotty realtime logs)

## Build it
```
./build.sh
```

## Run it
```
./startGotty.sh
```

## Data (gets stored outside of docker images)
```
/datadrive/LND      LND settings and LND wallet
/datadive/shared    BTCD credentials
/datadrive/Bitcoin  blockchain storage
```

## Logs
```
./logsBtcd.sh
./logsLND.sh
./logsApp.sh
```

## Testing
```
./telnetBTCD.sh
./telnetLND.sh
./telnetApp.sh
```


## BTC CTL
./telnetBTCD and then inside:
```
btcctl --rpccert=/rpc/rpc.cert --rpcuser=devuser --rpcpass=devpass version
btcctl --rpccert=/rpc/rpc.cert --rpcuser=devuser --rpcpass=devpass uptime
btcctl -u myuser -P mypass -s X.X.X.X:xxxx getpeerinfo --rpccert=rpc.cert
```

## LND CONFIGURATION
./telnetLND.sh and then inside:
```
./createwallet.sh      (and write down the recovery mnemonic codes, they protect your BTC balance) DO THIS ONLY ONCE!
./unlock.sh            (do this every time you re-start the lnd daemon.)
./connectJOLTFUN.sh    (establish a connection to the peer at joltfun)
./openJOLTFUN.sh       (open a channel and fund it with 100,000 sats)
```
