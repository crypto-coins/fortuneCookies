const fs = require('fs');
var moment = require ("moment");
var bluebird = require("bluebird");

const lnService = require('ln-service');

var getWalletInfo = bluebird.promisify(lnService.getWalletInfo);
var getChannels = bluebird.promisify(lnService.getChannels);
var getPeers = bluebird.promisify(lnService.getPeers);
var addPeer = bluebird.promisify(lnService.addPeer);
var getNetworkInfo = bluebird.promisify(lnService.getNetworkInfo);
var getNetworkGraph = bluebird.promisify(lnService.getNetworkGraph);
var setAutopilot = bluebird.promisify(lnService.setAutopilot);

var getInvoices = bluebird.promisify(lnService.getInvoices);
var getPayments = bluebird.promisify(lnService.getPayments);
var createInvoice = bluebird.promisify(lnService.createInvoice);

var subscribeToInvoices1 = lnService.subscribeToInvoices; // bluebird.promisify(lnService.subscribeToInvoices);
var subscribeToTransactions1 = lnService.subscribeToTransactions; // bluebird.promisify(lnService.subscribeToTransactions);



var getAccountingReport = bluebird.promisify(lnService.getAccountingReport);



const util = require('util');
const dns = require('dns');
const lookupAsync = util.promisify(dns.lookup);

async function Connect (config) {
    let buff = fs.readFileSync(config.dir + "tls.cert");  
    let certBase64 = buff.toString('base64');
    console.log("certBase64: " + certBase64);
        
    let buff2 = fs.readFileSync(config.dir + "data/chain/bitcoin/mainnet/admin.macaroon");  
    let macaroonBase64 = buff2.toString('base64');
    console.log("macaroonBase64: " + macaroonBase64);
    
    var r = await lookupAsync (config.ip);
    console.log(r);
    var ip = r.address;
        
    const lnd = lnService.lightningDaemon({
      cert: certBase64,
      macaroon: macaroonBase64,
      socket: ip + ':10001',
    });

    return lnd;
}

async function WalletInfo (lnd) {
    return await getWalletInfo({lnd});
}
 
async function Channels (lnd) {
    var result = await getChannels({lnd});
    return result.channels;
}

async function Peers (lnd) {
    var result = await getPeers({lnd});
    return result.peers;
}

async function NetworkInfo (lnd) {
    var result = await getNetworkInfo({lnd});
    return result;
}

async function NetworkGraph (lnd) {
    var result = await getNetworkGraph({lnd});
    return result;
}



async function AddPeer (lnd, public_key, socket) {
    var result = await addPeer({lnd, public_key, socket});
    return result;
}


async function Autopilot (lnd, is_enabled) {
    var result = await setAutopilot({lnd, is_enabled});
    return result;
}



async function Invoices (lnd) {
    var result = await getInvoices({lnd});
    return result.invoices;
}

async function subscribeToInvoices (lnd) {
    try {
        var result = subscribeToInvoices1({lnd});
        return result;
    }
    catch (err) {
        console.log("ERROR subscribing to Invoices: " + err)
        return undefined;
    }
}

async function subscribeToTransactions (lnd) {
    var result = subscribeToTransactions1({lnd});
    return result;
}





async function Payments (lnd) {
    var result = await getPayments({lnd});
    return result.payments;
}

async function AccountingReport (lnd) {
    var result = await getAccountingReport({lnd});
    return result;
}




async function CreateInvoice (lnd, tokens, description) {
    var expires_at = moment.utc().add(1,"h").toISOString();
    var result = await createInvoice({lnd, expires_at, description, tokens});
    return result;
}

module.exports= {
    Connect,
    WalletInfo,
    Channels,
    Peers,
    AddPeer,
    NetworkInfo,
    NetworkGraph,
    Autopilot,
    Invoices,
    Payments,
    CreateInvoice,
    AccountingReport,

    subscribeToInvoices,
    subscribeToTransactions
}

