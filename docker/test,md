


    clightning:
       image: elementsproject/lightningd
       container_name: lightningd
       command:
         - --network=bitcoin
         # - --bitcoin-rpcconnect=btcd
         # - --bitcoin-rpcuser=rpcuser
         # - --bitcoin-rpcpassword=rpcpass
         # - --bitcoin-rpccert="/rpc/rpc.cert" 
         - --btcd-rpchost=btcd     
         - --btcd-rpcuser=rpcuser
         - --btcd-rpcpass=rpcpass
         - --btcd-rpccert=/rpc/rpc.cert
         - --alias=mybongistan
         - --log-level=debug
       environment:
         EXPOSE_TCP: "true"
       expose:
         - "9735"
       ports:
         - "0.0.0.0:9735:9735"
       volumes:
         - "lightning:/root/.lightning"
         - "bitcoin:/etc/bitcoin"
         - shared:/rpc
       links:
         - btcd:rpcserver