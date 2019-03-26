const fs = require('fs');
var bluebird = require("bluebird");
const lnService = require('ln-service');

var getWalletInfo = bluebird.promisify(lnService.getWalletInfo);

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

  



module.exports= {
    Connect,
    WalletInfo
}

