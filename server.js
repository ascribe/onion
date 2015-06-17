var argv = require('yargs').argv;
var express = require('express');
var compression = require('compression');

var baseUrl = (function () { var baseUrl = process.env.ONION_BASE_URL || '/'; return baseUrl + (baseUrl.match(/\/$/) ? '' : '/'); })();

var app = express();

app.use(compression());

app.use(baseUrl + 'static/js', express.static(__dirname + '/build/js'));
app.use(baseUrl + 'static/img', express.static(__dirname + '/build/img'));
app.use(baseUrl + 'static/css', express.static(__dirname + '/build/css'));
app.use(baseUrl + 'static/fonts', express.static(__dirname + '/build/fonts'));
app.use(baseUrl + 'static/thirdparty', express.static(__dirname + '/node_modules'));

app.get(/.*/, function(req, res) {
    console.log('%s %s', req.method, req.path);
    res.sendFile(__dirname + '/build/index.html');
});


if (require.main === module) {
    var port = process.env.PORT || 4000;
    console.log('Starting Onion server on port', port,
                'baseUrl is set to', baseUrl);
    app.listen(port);
}

module.exports.app = app;
