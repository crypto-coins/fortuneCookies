var R = require("ramda");


var nicks = [
    { public_key: "0374ecf61ed6c1208c42339f47decde2bc0c4393ac95f07827b3471e939d7eb961", nick_name: "jolt"},
    { public_key: "03021c5f5f57322740e4ee6936452add19dc7ea7ccf90635f95119ab82a62ae268", nick_name: "blue-wallet"},
    { public_key: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f", nick_name: "eclair"},
    { public_key: "03bb88ccc444534da7b5b64b4f7b15e1eccb18e102db0e400d4b9cfe93763aa26d", nick_name: "l-to-me"},
    { public_key: "03bc9337c7a28bb784d67742ebedd30a93bacdf7e4ca16436ef3798000242b2251", nick_name: "ln-big"}
];


function AddNickPeer (peer) {
    var nick = R.find(R.propEq('public_key', peer.public_key))(nicks);
    if (nick==undefined) {
        peer.nick = "?";
    } else {
        peer.nick = nick.nick_name;
    }
}

function AddNickChannel (channel) {
    try {
        var nick = R.find(R.propEq('public_key', channel.partner_public_key))(nicks);
        if (nick==undefined) {
            peer.nick = "?";
        } else {
            peer.nick = nick.nick_name;
        }
    }
    catch (err) {
        console.log("Error AddNickChannel for: "+ JSON.stringify(channel))
    }
}



module.exports= {
    AddNickPeer,
    AddNickChannel
};