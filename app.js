var static = require('node-static');

var file = new(static.Server)('./dist');

require('http').createServer(function (request, response) {
    file.serve(request, response);
}).listen(process.env.PORT || process.env.VCAP_APP_PORT || 3000);