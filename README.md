# lightning fortune cookies

Buy Chinese Fortune Cookies with Lightning satoshis.
A demo-site to show how to accept Lightning payments.

## Technology
- Docker + Docker-Compose
- BTCD daemon to download blockchain
- LND daemon to interact with lightning network.
- Node.js app interacts with LND.
- Gotty to display realtime logs in webbrowser
- tmux / byobu to not terminate the batch file on shell disconnect

## Requirements
- Linux machine, hosted in Azure/GoogleCloud/AWS
- 1 Terrabyte disk storage, mounted on /datadrive to store the bitcoin blockchain (currently 250 gigs)
- AZURE ADD VM IMAGE https://docs.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal
- open ports: 22 (ssh), 80 (web frontend), 8051 (gotty realtime logs)


## Run it
```
./startGotty.sh
```

## Data
/datadrive/LND      LND settings and LND wallet
/datadive/shared    BTCD credentials
/datadrive/Bitcoin  blockchain storage

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
Run inside the Docker image:
```
btcctl --rpccert=/rpc/rpc.cert --rpcuser=devuser --rpcpass=devpass version
btcctl --rpccert=/rpc/rpc.cert --rpcuser=devuser --rpcpass=devpass uptime
btcctl -u myuser -P mypass -s X.X.X.X:xxxx getpeerinfo --rpccert=rpc.cert
```


Network Reachability
If you’d like to signal to other nodes on the network that you’ll accept incoming channels (as peers need to connect inbound to initiate a channel funding workflow), then the --externalip flag should be set to your publicly reachable IP address.

Optionally, if you’d like to have a persistent configuration between lnd launches, allowing you to simply type lnd --bitcoin.testnet --bitcoin.active at the command line, you can create an lnd.conf.

Running an lnd node means that it is listening for payments, watching the blockchain, etc. By default it is awaiting user input.

lncli is the command line client used to interact with your lnd nodes. 

