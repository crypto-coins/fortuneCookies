


$ export NETWORK="simnet" 
$ docker-compose run -d --name alice lnd_btc
$ docker exec -i -t alice bash
$ lncli --network=mainnet newaddress np2wkh 
$ lncli --network=simnet walletbalance
$ lncli --network=simnet openchannel --node_key=<bob_identity_pubkey> --local_amt=1000000


$ docker-compose run -d --name bob lnd_btc
$ docker exec -i -t bob bash

$ lncli --network=mainnet getinfo
$ lncli getinfo
$ lncli connect 02ad6fb8d693dc1e4569bcedefadf5f72a931ae027dc0f0c544b34c1c6f3b9a02b@167.99.50.31:9735^C
$ lncli --network=simnet listpeers


# Get the IP address of "Bob" node:
$ docker inspect bob | grep IPAddress

# Connect "Alice" to the "Bob" node:
alice$ lncli --network=simnet connect <bob_pubkey>@<bob_host>



Create the `Alice<->Bob` channel.
```bash
# Open the channel with "Bob":


# Include funding transaction in block thereby opening the channel:
$ docker-compose run btcctl generate 3

# Check that channel with "Bob" was opened:
alice$ lncli --network=simnet listchannels


Send the payment from `Alice` to `Bob`.
```bash
# Add invoice on "Bob" side:
bob$ lncli --network=simnet addinvoice --amt=10000
{
        "r_hash": "<your_random_rhash_here>", 
        "pay_req": "<encoded_invoice>", 
}

# Send payment from "Alice" to "Bob":
alice$ lncli --network=simnet sendpayment --pay_req=<encoded_invoice>

# Check "Alice"'s channel balance
alice$ lncli --network=simnet channelbalance

# Check "Bob"'s channel balance
bob$ lncli --network=simnet channelbalance
```

Now we have open channel in which we sent only one payment, let's imagine
that we sent lots of them and we'd now like to close the channel. Let's do
it!
```bash
# List the "Alice" channel and retrieve "channel_point" which represents
# the opened channel:
alice$ lncli --network=simnet listchannels
{
    "channels": [
        {
            "active": true,
            "remote_pubkey": "0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38",
       ---->"channel_point": "3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275:0",
            "chan_id": "1337006139441152",
            "capacity": "1005000",
            "local_balance": "990000",
            "remote_balance": "10000",
            "commit_fee": "8688",
            "commit_weight": "724",
            "fee_per_kw": "12000",
            "unsettled_balance": "0",
            "total_satoshis_sent": "10000",
            "total_satoshis_received": "0",
            "num_updates": "2",
            "pending_htlcs": [
            ],
            "csv_delay": 4
        }
    ]
}

# Channel point consists of two numbers separated by a colon. The first one 
# is "funding_txid" and the second one is "output_index":
alice$ lncli --network=simnet closechannel --funding_txid=<funding_txid> --output_index=<output_index>

# Include close transaction in a block thereby closing the channel:
$ docker-compose run btcctl generate 3

# Check "Alice" on-chain balance was credited by her settled amount in the channel:
alice$ lncli --network=simnet walletbalance

# Check "Bob" on-chain balance was credited with the funds he received in the
# channel:
bob$ lncli --network=simnet walletbalance
{
    "total_balance": "10000",
    "confirmed_balance": "10000",
    "unconfirmed_balance": "0"
}
```

### Connect to faucet lightning node
In order to be more confident with `lnd` commands I suggest you to try 
to create a mini lightning network cluster ([Create lightning network cluster](#create-lightning-network-cluster)).

In this section we will try to connect our node to the faucet/hub node 
which we will create a channel with and send some amount of 
bitcoins. The schema will be following:

```
+ ----- +                   + ------ +         (1)        + --- +
| Alice | <--- channel ---> | Faucet |  <--- channel ---> | Bob |    
+ ----- +                   + ------ +                    + --- +        
    |                            |                           |           
    |                            |                           |      <---  (2)         
    + - - - -  - - - - - - - - - + - - - - - - - - - - - - - +            
                                 |
                       + --------------- +
                       | Bitcoin network |  <---  (3)   
                       + --------------- +        
        
        
 (1) You may connect an additional node "Bob" and make the multihop
 payment Alice->Faucet->Bob
  
 (2) "Faucet", "Alice" and "Bob" are the lightning network daemons which 
 create channels to interact with each other using the Bitcoin network 
 as source of truth.
 
 (3) In current scenario "Alice" and "Faucet" lightning network nodes 
 connect to different Bitcoin nodes. If you decide to connect "Bob"
 to "Faucet" then the already created "btcd" node would be sufficient.
```

First of all you need to run `btcd` node in `testnet` and wait for it to be 
synced with test network (`May the Force and Patience be with you`).
```bash 
# Init bitcoin network env variable:
$ export NETWORK="testnet"

# Run "btcd" node:
$ docker-compose up -d "btcd"
```

After `btcd` synced, connect `Alice` to the `Faucet` node.

The `Faucet` node address can be found at the [Faucet Lightning Community webpage](https://faucet.lightning.community).

```bash 
# Run "Alice" container and log into it:
$ docker-compose up -d "alice"; docker exec -i -t "alice" bash

# Connect "Alice" to the "Faucet" node:
alice$ lncli --network=testnet connect <faucet_identity_address>@<faucet_host>
```

After a connection is achieved, the `Faucet` node should create the channel
and send some amount of bitcoins to `Alice`.

**What you may do next?:**
- Send some amount to `Faucet` node back.
- Connect `Bob` node to the `Faucet` and make multihop payment (`Alice->Faucet->Bob`)
- Close channel with `Faucet` and check the onchain balance.

### Questions
[![Irc](https://img.shields.io/badge/chat-on%20freenode-brightgreen.svg)](https://webchat.freenode.net/?channels=lnd)

* How to see `alice` | `bob` | `btcd` logs?
```bash
docker-compose logs <alice|bob|btcd>
```
