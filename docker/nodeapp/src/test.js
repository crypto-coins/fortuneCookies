/*var lightning = require("bitcoin-lightning-nodejs");


var request = {};
lightning.ln.channelBalance(request, function(err, response) {
  console.log(response);
});*/

const fs = require('fs');

const lnService = require('ln-service');


var dir = "/run/media/florian/ZEUS_USBG3_1TERRA/lnd/"


let buff = fs.readFileSync(dir + "tls.cert");  
let certBase64 = buff.toString('base64');
console.log("certBase64: " + certBase64);


let buff2 = fs.readFileSync(dir + "data/chain/bitcoin/mainnet/admin.macaroon");  
let macaroonBase64 = buff2.toString('base64');
console.log("macaroonBase64: " + macaroonBase64);



const lnd = lnService.lightningDaemon({
  cert: certBase64,
  macaroon: macaroonBase64,
  socket: '127.0.0.1:10009',
});
 
lnService.getWalletInfo({lnd}, (error, result) => {
  console.log(result);
  console.log(error);
});
