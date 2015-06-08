var express = require('express');
var app = express();

app.use('/static/js', express.static(__dirname + '/build/js'));
app.use('/static/css', express.static(__dirname + '/build/css'));
app.use('/static/fonts', express.static(__dirname + '/build/fonts'));
app.use('/static/thirdparty/', express.static(__dirname + '/node_modules'));

app.get(/.*/, function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


if (require.main === module) {
    app.listen(process.env.PORT || 4000);
}

module.exports.app = app;
