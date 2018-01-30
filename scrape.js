function add(dict, day, time, loc) {
  if (!dict.hasOwnProperty(day))
    dict[day] = {};
  if (!dict[day].hasOwnProperty(time))
      dict[day][time] = [];
  dict[day][time].push(loc);
}

function getDates(raw, httpReq, httpResp) {
  return function(e, xhr, body) { getSisigDates(raw, httpResp, e, xhr, body); }
}

function getSisigDates(raw, httpResp, err, xhrResp, body) {
  var dates = {};
  if (!err && xhrResp.statusCode == 200) {
    var $ = cheerio.load(body);
    var sections = $('section');
    sections.each(function(i, elem) {
      var date = $(this).data('wcal-date');
      if (date && date != 'error') {
        var loc = $(this).find('a.map-trigger').text().trim();
        var day = $(this).find('div.date').text().trim().split(/[\s\n]+/);
        var time = $(this).find('div.time').text().trim().replace(/(\w+)[\s\n]*to[\n\s]*(\w+)/, "$1 - $2");
        var dayStr = day[day.length-2] + " " + date;
        add(dates, dayStr, time, loc);
      }
    });
  }

function makeRequest(httpRequest, httpResponse) {
  var options = {
    url:"http://senorsisig.com/",
    headers:{
      'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0 Iceweasel/45.0a2',
      'Accept':'text/html;q=0.9,*;q=0.8'
    }
  };
  // TODO implement regular caching to prevent needless requests and parsing
  request(options, getDates(req.query.raw, req, res));
};
