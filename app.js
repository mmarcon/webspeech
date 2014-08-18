var static = require('node-static');

var file = new(static.Server)('./dist');

var PORT = process.env.PORT || 1337;

console.log('PORT = ' + PORT);

require('http').createServer(function (request, response) {
    file.serve(request, response);
}).listen(PORT);
