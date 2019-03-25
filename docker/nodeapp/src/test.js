/*var lightning = require("bitcoin-lightning-nodejs");


var request = {};
lightning.ln.channelBalance(request, function(err, response) {
  console.log(response);
});*/

var ln = require("./ln.js");



var config =  {
  dir: "/run/media/florian/ZEUS_USBG3_1TERRA/lnd/",
  ip: "127.0.0.1"
};

var config2 = {
  dir: "/root/.lnd/", // this direction gets mounted via docker-compose
  ip:"lnd"  // virtual dns names also defined in docker-compose
}; 


async function demo () {
  var lnd = ln.Connect(config2);

  var result = await ln.WalletInfo(lnd);
  console.log(result);
}


demo();
 
