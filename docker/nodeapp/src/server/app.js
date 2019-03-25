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
//app.use(compression({filter: shouldCompress}))

var starttime = moment();
app.get('/', async function(req, res) {
    res.render('main', {
        starttime
    });
});



app.get('/web', async function(req, res) {
    res.render('web', {
    });
});


var port = 8088;
app.listen(port);
console.log("listening on port ", port)


var config =  {
    dir: "/run/media/florian/ZEUS_USBG3_1TERRA/lnd/",
    ip: "127.0.0.1"
  };

var config2 = {
    dir: "/root/.lnd/", // this direction gets mounted via docker-compose
    ip:"lnd"  // virtual dns names also defined in docker-compose
  }; 

  var ln = require("../ln.js");

var lnd = ln.Connect(config2);

app.get('/backoffice', async function(req, res) {

    var wallet = undefined;
    var error = undefined;
    try {
        wallet =  await ln.WalletInfo(lnd);
    }
    catch (err) {
        error = err;
        wallet = undefined;
    }

    res.render('backoffice', {
        wallet,
        error
    });
});


  