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
  console.log(new Date().toISOString() + " " + req.connection.remoteAddress);
  next();
}
app.use(logger);

function getDates(response) {
  return function(e, xhr, body) { getSisigDates(response, e, xhr, body); }
}

function add(dict, key, value) {
    if (!dict[key])
        dict[key] = [];
    dict[key].push(value);
}

function getSisigDates(response, err, res, body) {
  //var table = document.createElement('table');

  var dates = {};
  if (!err && res.statusCode == 200) {
    var $ = cheerio.load(body);
    var sections = $('section');
    sections.each(function(i, elem) {
      var date = $(this).data('wcal-date');
      if (date && date != 'error') {
        var loc = $(this).find('a.map-trigger').text().trim();
        var day = $(this).find('div.date').text().trim().split(/[\s\n]+/);
        var time = $(this).find('div.time').text().trim().replace(/(\w+)[\s\n]*to[\n\s]*(\w+)/, "$1 to $2");
        add(dates, day[day.length-2] + " " + date, [time, loc]);

        /*
        var row = document.createElement('tr');
        var dayCell = document.createElement('td');
        var timeCell = document.createElement('td');
        var locCell = document.createElement('td');

        dayCell.appendChild(document.createTextNode(day + " " + date));
        timeCell.appendChild(document.createTextNode(time));
        locCell.appendChild(document.createTextNode(loc));

        row.appendChild(dayCell);
        row.appendChild(timeCell);
        row.appendChild(locCell);
        */
      }
    });
  }
  response.send(dates);
}

app.get('/', function(req, res) {
  var options = {
    url:"http://senorsisig.com/",
    headers:{
      'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0 Iceweasel/45.0a2',
      'Accept':'text/html;q=0.9,*;q=0.8'
    }
  };
  request(options, getDates(res));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


