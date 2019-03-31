FROM golang:1.11-alpine as builder

RUN apk add --no-cache git

# Copy in the local repository to build from.
#COPY . /go/src/github.com/lightningnetwork/lnd
RUN git clone https://github.com/lightningnetwork/lnd /go/src/github.com/lightningnetwork/lnd

# Force Go to use the cgo based DNS resolver. This is required to ensure DNS
# queries required to connect to linked containers succeed.
ENV GODEBUG netdns=cgo

# Install dependencies and install/build lnd.
RUN apk add --no-cache --update alpine-sdk \
    git \
    make \
&&  cd /go/src/github.com/lightningnetwork/lnd \
&&  make \
&&  make install

# Start a new, final image to reduce size.
FROM alpine as final

# Expose lnd ports (server, rpc).
EXPOSE 9735 10001 8089 10011

# Copy the binaries and entrypoint from the builder image.
COPY --from=builder /go/bin/lncli /bin/
COPY --from=builder /go/bin/lnd /bin/

# Add bash.
RUN apk add --no-cache \
    bash


# Copy the entrypoint script.
COPY "docker/lnd/start-lnd.sh" .
RUN chmod +x start-lnd.sh

COPY "docker/lnd/networkinfo.sh" .
RUN chmod +x networkinfo.sh

COPY "docker/lnd/info.sh" .
RUN chmod +x info.sh

COPY "docker/lnd/createwallet.sh" .
RUN chmod +x createwallet.sh

COPY "docker/lnd/unlock.sh" .
RUN chmod +x unlock.sh

COPY "docker/lnd/newaddress.sh" .
RUN chmod +x newaddress.sh

COPY "docker/lnd/walletbalance.sh" .
RUN chmod +x walletbalance.sh


COPY "docker/lnd/listpeers.sh" .
RUN chmod +x listpeers.sh

COPY "docker/lnd/listchannels.sh" .
RUN chmod +x listchannels.sh

COPY "docker/lnd/invoice.sh" .
RUN chmod +x invoice.sh

# peer management

# LighteningToMe
COPY "docker/lnd/connectLTOME.sh" .
RUN chmod +x connectLTOME.sh

COPY "docker/lnd/fundLTOME.sh" .
RUN chmod +x fundLTOME.sh

# Eclair
COPY "docker/lnd/connectECLAIR.sh" .
RUN chmod +x connectECLAIR.sh

COPY "docker/lnd/fundECLAIR.sh" .
RUN chmod +x fundECLAIR.sh

# Blue
COPY "docker/lnd/connectBLUE.sh" .
RUN chmod +x connectBLUE.sh

COPY "docker/lnd/fundBLUE.sh" .
RUN chmod +x fundBLUE.sh

# LN BIG

COPY "docker/lnd/connectLNBIG.sh" .
RUN chmod +x connectLNBIG.sh

# JOLT FUN - remove this.

COPY "docker/lnd/connectJOLTFUN.sh" .
RUN chmod +x connectJOLTFUN.sh


# send BTC via Lightning

COPY "docker/lnd/send.sh" .
RUN chmod +x send.sh

