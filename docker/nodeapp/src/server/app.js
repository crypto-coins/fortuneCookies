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

app.get('/backoffice', async function(req, res) {
    res.render('backoffice', {
    });
});

app.get('/web', async function(req, res) {
    res.render('web', {
    });
});


var port = 8088;
app.listen(port);
console.log("listening on port ", port)