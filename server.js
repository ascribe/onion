var express = require('express');
var compression = require('compression')
var baseUrl = '/beta';

var app = express();

app.use(compression());

app.use(baseUrl + '/static/js', express.static(__dirname + '/build/js'));
app.use(baseUrl + '/static/css', express.static(__dirname + '/build/css'));
app.use(baseUrl + '/static/fonts', express.static(__dirname + '/build/fonts'));
app.use(baseUrl + '/static/thirdparty/', express.static(__dirname + '/node_modules'));

app.get(/.*/, function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

if (require.main === module) {
    app.listen(process.env.PORT || 4000);
}

module.exports.app = app;
