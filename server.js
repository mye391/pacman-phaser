const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(morgan('combined'));


app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(9001, "127.0.0.1", function() {
    const host = server.address().address;
    const port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
