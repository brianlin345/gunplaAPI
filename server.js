var app = require('./index');
var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
