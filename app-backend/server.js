let http = require("http");
let port = 9000;
let server = http.createServer(function(request, response) {
 response.setHeader("Content-Type", "text/plain");
 response.writeHead(200);
 response.end("Hello World from Node");
});
server.listen(port, function() {
 console.log("Server listening on port " + port);
});
