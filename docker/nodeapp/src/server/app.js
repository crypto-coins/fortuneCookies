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
    methodOverride = require('method-override');
    
    var ln = require("../ln.js");
    var lnd = undefined; 
    var {GetQuote} = require("./fortune.js");

    
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

var config =  {
    dir: "/run/media/florian/ZEUS_USBG3_1TERRA/lnd/",
    ip: "localhost"
  };

var config2 = {
    dir: "/root/.lnd/", // this direction gets mounted via docker-compose
    ip:"lnd"  // virtual dns names also defined in docker-compose
  }; 




app.get('/', async function(req, res) {

    command = req.query.command;
    if (command==undefined) command = "start";

    var invoice = undefined;
    var quote = undefined;

    if (command=="makeinvoice") {
        if (lnd==undefined) lnd = await ln.Connect(config);
        var satoshis = Math.floor(Math.random() * 5) + 1;
        invoice = await ln.CreateInvoice(lnd, satoshis, "fortunecookie") ;
        console.log(invoice);
    }

    if (command=="paymentsuccess") {
        quote = GetQuote();
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


var port = 18088;
app.listen(port);
console.log("listening on port ", port)


 


app.get("/qr", async function (req, res) {
    var qr = require('qr-image');
    var text = req.query.text;
    var qr_svg = qr.image(text, { type: 'svg' });
    res.setHeader('Content-Type', 'image/svg+xml');
    qr_svg.pipe(res); 
});




app.get('/backoffice', async function(req, res) {

    var conf = config;

    var wallet = undefined;
    var error = undefined;
    try {

        if (lnd==undefined) lnd = await ln.Connect(conf);

        wallet =  await ln.WalletInfo(lnd);
    }
    catch (err) {
        error = err;
        wallet = undefined;
    }

    var invoices  = [];
    try {
        invoices = await ln.Invoices(lnd);
        console.log(invoices);
    } catch (err) {
        error = err;
        invoices = [];
    }

    var channels  = [];
    try {
        channels = await ln.Channels(lnd);
        console.log(channels);
    } catch (err) {
        error = err;
        channels = [];
    }


    

    res.render('backoffice', {
        ip : conf.ip,
        wallet,
        invoices,
        channels,
        error
    });
});


  