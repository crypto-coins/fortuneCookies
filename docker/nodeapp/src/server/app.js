var R = require("ramda"),
    bluebird = require("bluebird"),
    moment = require("moment"),
    fs = require('fs'),
    pReadFile = bluebird.promisify(fs.readFile),

    // Web
    express = require('express'), // express framework (page routing)
    ejs = require('ejs'), // templating engine
    session = require("express-session"),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),

    ln = require("../ln.js"),
    {AddNickPeer,AddNickChannel} = require("../peerNick.js"),
    lnd = undefined,
    {GetQuote} = require("./fortune.js");

// express.js engine
var app = express();
app.enable('trust proxy');
app.set('view engine', 'ejs'); // set the view engine to use ejs
app.set('views', __dirname + '/views'); // rendered views
app.use(cookieParser());
app.use(bodyParser.raw());
app.use(bodyParser.text()); // support TEXT bodies
app.use(bodyParser.json({limit: '50mb', extended: true})); //  support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // support URL-encode
app.use(methodOverride());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use('/public',  express.static('server/public'))
//app.use(compression({filter: shouldCompress}))

var config = {
    dir: "/root/.lnd/", // this direction gets mounted via docker-compose
    ip:"lnd",  // virtual dns names also defined in docker-compose
    port: 8088
  }; 

var isDev = process.env.ISDEV;
if ((isDev != undefined) && (isDev=="true")) {
    // hack to allow running node app only in development mode by setting an environment variable
    config = {
        dir: "/datadrive/lnd/",
        ip: "localhost",
        port: 18088
      };
}

var invoices = {};

async function Connect () {

    lnd = await ln.Connect(config);
    if (lnd == undefined) return;

    console.log("subscribing to invoices..")
    var sub = await ln.subscribeToInvoices(lnd);
    if (sub != undefined) {
      sub.on('error', () => { console.log("SUBSCRIBE INVOICES ERROR!")  });
      sub.on('end', () => { console.log("SUBSCRIBE INVOICES END!")  });
      sub.on('status', () => { console.log("SUBSCRIBE INVOICES status!")  });
      sub.on('data', invoice => {
        console.log("INVOICE RCVD: " + JSON.stringify(invoice));
        invoices = R.set(R.lensProp(invoice.id), invoice, invoices);
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

}


app.get('/', async function(req, res) {

    command = req.query.command;
    if (command==undefined) command = "start";

    var invoice = undefined;
    var quote = undefined;

    if (command=="makeinvoice") {
        try {
           if (lnd==undefined) await Connect();
           var satoshis = Math.floor(Math.random() * 5) + 1;
           invoice = await ln.CreateInvoice(lnd, satoshis, "fortunecookie") ;
           console.log(invoice);
        } catch (err) {
          console.log("ERROR MAKING INVOICE " + JSON.stringify(err));
        }
    }

    if (command=="paymentsuccess") {
        var invoiceId = req.query.invoiceId;
        var invoiceAmount = req.query.invoiceAmount;
        quote = GetQuote();
        invoice =  {
            id:invoiceId,
            amount: invoiceAmount
        }
    }

    res.render('main', {
        invoice,
        quote
    });
});



app.get('/web', async function(req, res) {
    res.render('web', {
    });
});


app.get('/terminal', async function(req, res) {
    res.render('terminal', {
    });
});


app.listen(config.port);
console.log("listening on port ", config.port)

app.get("/qr", async function (req, res) {
    // Render QR code for a lightning invoice
    var qr = require('qr-image');
    var text = req.query.text;
    var qr_svg = qr.image(text, { type: 'svg' });
    res.setHeader('Content-Type', 'image/svg+xml');
    qr_svg.pipe(res); 
});

app.get("/invoicestatus", async function (req, res) {
    // check if invoice has been paid
    var invoiceId = req.query.invoiceId;
    var paid = false;
    //var r = Math.floor(Math.random() * 10);
    //var paid = (r > 7); // 30% chance to get paid.

    var invoice = R.prop(invoiceId,invoices);
    if (invoice!=undefined) {
        if (invoice.is_confirmed==true) paid=true;
    }

    var invoiceStatus =  {
        invoiceId,
        paid,
        time: moment.utc().toISOString()
    }
    res.json(invoiceStatus);
});


app.get('/backoffice', async function(req, res) {
    var peers = [];
    var channels = [];
    var invoices = [];
    var networkinfo = [];
    var payments = [];
    var balance = {}

    var wallet = undefined;
    var error = undefined;

    try {
        if (lnd==undefined) await Connect();
    }
    catch (err) {
       lnd = undefined;
       console.log("Error connecting to lnd: " + JSON.stringify(err));
    }

   if (lnd != undefined) {
      try {
        wallet =  await ln.WalletInfo(lnd);
        console.log("Wallet Info:")
        console.log(wallet)
      }
      catch (err) {
        console.log("Error getting wallet info: " + JSON.stringify(err) );
        error = err;
        wallet = undefined;
      }

      try {
         invoices = await ln.Invoices(lnd);
         console.log("Invoices:")
         console.log(invoices);
      } catch (err) {
         error = err;
         invoices = [];
         console.log("Error getting Invoices: " + JSON.stringify(err));
      }

      
      try {
        peers = await ln.Peers(lnd);
        R.map(AddNickPeer, peers);
        
        console.log("Peers:")
        console.log(peers);
      } catch (err) {
         error = err;
         peers = [];
         console.log("Error getting peers: " + JSON.stringify(err));
      }


      try {
        channels = await ln.Channels(lnd);
        console.log("Channels:")
        console.log(channels);
        R.map(AddNickChannel, channels);
      } catch (err) {
         error = err;
         channels = [];
         console.log("Error getting Channels: " + JSON.stringify(err));
      }

      try {
        networkinfo = await ln.NetworkInfo(lnd);
        console.log("NetworkInfo:")
        console.log(networkinfo);
      } catch (err) {
         error = err;
         networkinfo = [];
         console.log("Error getting NetworkInfo: " + JSON.stringify(err));
      }

      try {
        payments = await ln.Payments(lnd);
        console.log("payments:")
        console.log(payments);
      } catch (err) {
         error = err;
         payments = [];
         console.log("Error getting payments: " + JSON.stringify(err));
      }

      try {
        var cb =  await ln.getPendingChainBalance({lnd});
        console.log(cb)
        balance.chainBalancePending = cb.pending_chain_balance;
        var pcb = await ln.getChainBalance({lnd});
        console.log(pcb)
        balance.chainBalance = pcb.chain_balance;
        var channelBalance = await ln.getChannelBalance({lnd});
        balance.channelBalance = channelBalance.channel_balance;
        balance.channelPendingBalance = channelBalance.pending_balance;

        console.log("balance:")
        console.log(balance);
      } catch (err) {
         error = err;
         balance = {};
         console.log("Error getting balance: " + JSON.stringify(err));
      }

    }
  
    res.render('backoffice', {
        ip : config.ip,
        networkinfo,
        peers,
        channels,
        wallet,
        balance,
        invoices,
        payments,
        error
    });
});
