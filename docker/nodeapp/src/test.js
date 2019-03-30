var bluebird = require("bluebird");

/*var lightning = require("bitcoin-lightning-nodejs");


var request = {};
lightning.ln.channelBalance(request, function(err, response) {
  console.log(response);
});*/

var ln = require("./ln.js");


var config =  {
  dir: "/run/media/florian/ZEUS_USBG3_1TERRA/lnd/",
  ip: "localhost"
};

var config2 = {
  dir: "/root/.lnd/", // this direction gets mounted via docker-compose
  ip:"lnd"  // virtual dns names also defined in docker-compose
}; 


async function demo () {
  var conf = config;

  console.log("Connecting to LND daemon at: " + conf.ip)
  var lnd = await ln.Connect(conf);
  try {
    var result = await ln.WalletInfo(lnd);
    console.log(result);
  }
  catch (Err) {
    console.log("Err: " + JSON.stringify(Err))
  }


  var invoices = await ln.Invoices(lnd);
  console.log(invoices)

  console.log("subscribing to invoices..")
  var sub = await ln.subscribeToInvoices(lnd);
  if (sub != undefined) {
    sub.on('error', () => { console.log("SUBSCRIBE INVOICES ERROR!")  });
    sub.on('end', () => { console.log("SUBSCRIBE INVOICES END!")  });
    sub.on('status', () => { console.log("SUBSCRIBE INVOICES status!")  });
    
    sub.on('data', invoice => {
      console.log("INVOICE RCVD: " + JSON.stringify(invoice))
    });
  }

  console.log("subscribing to transactions..")
  var subT = await ln.subscribeToTransactions(lnd);
  if (subT != undefined) {
    subT.on('error', () => {
        console.log("SUBSCRIBE TRANSACTION ERROR!")
    });
    subT.on('data', tx => {
      console.log("TRANSACTION RCVD: " + JSON.stringify(tx))
    });
  }

  console.log("Waiting for invoice transactions (30 seconds max)")

  console.log("creating demo invoice..")
  var invoice = await ln.CreateInvoice(lnd, 1, "bongo") ;
  console.log("CREATED INVOICE: " + JSON.stringify(invoice));

  await bluebird.Promise.delay(30000);
  console.log("test done.")



}

demo();
 
