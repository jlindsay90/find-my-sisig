var express = require('express');
var app = express();

var request = require('request');
var cheerio = require('cheerio');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  var options = {
    url:"http://senorsisig.com/",
    headers:{
      'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0 Iceweasel/45.0a2',
      'Accept':'text/html;q=0.9,*;q=0.8'
    }
  };
  // TODO implement regular caching to prevent needless requests and parsing
  request(options, getDates(req.query.raw, req, res));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

