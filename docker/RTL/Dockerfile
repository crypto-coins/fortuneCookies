FROM node:10-alpine

RUN apk add --no-cache tini git gcc musl-dev

WORKDIR /RTL

# Grab and install the latest version of of btcd and all related dependencies.
RUN git clone https://github.com/ShahanaFarooqui/RTL.git . 


# COPY package.json /RTL/package.json
# COPY package-lock.json /RTL/package-lock.json

# Install dependencies
RUN npm install

COPY ./RTL.conf /RTL

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "-g", "--"]

CMD ["node", "rtl"]