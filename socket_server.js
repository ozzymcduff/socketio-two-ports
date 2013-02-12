var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url');

app.listen(8099);

function handler (req, res) {
	var parsed = url.parse(req.url);
	if (parsed.pathname==='/pingjs'){
		res.writeHead(200,{
         'Content-Type': 'application/json',
         //http://devlicio.us/blogs/derik_whittaker/archive/2013/02/10/help-i-am-getting-an-xmlhttprequest-exception-of-access-control-allow-orig.aspx
         'Access-Control-Allow-Origin':'http://localhost:8100'
     	});
    	res.end(JSON.stringify({test:'some json'}));
	}else{
		//console.log(req);
    	res.writeHead(200);
    	res.end("server");		
	}
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});