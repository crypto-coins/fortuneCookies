const fs = require('fs');


var buf = fs.readFileSync("./server/fortune.json");  
var quotes = JSON.parse(buf);

console.log("Quotes Loaded: ", quotes.length);


function GetQuote () {
    var index =  Math.floor(Math.random() * quotes.length);   
    return quotes[index];
}

module.exports = {
    GetQuote
};