var express = require('express');
var app = express();

var request = require('request');
var cheerio = require('cheerio');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var logger = function(req, res, next) {
  console.log('VISITED');
  console.log(new Date().toISOString() + " " + req.connection.remoteAddress);
  next();
}
app.use(logger);

function getSisigDates() {
  dates = {}
  request('http://senorsisig.com/', function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var $ = cheerio.load(body);
      $('section').each(function(i, elem) {
          var date = elem.data('wcal-date');
          if (date && date != 'error')
              dates[date] = 'HELLO';
      });
    }
  });
  return dates;
}

app.get('/', function(request, response) {
  console.log(request.remote)
  response.send(getSisigDates());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


