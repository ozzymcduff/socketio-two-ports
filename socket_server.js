var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url')
  , _ = require('underscore');
  io.configure(function () { 
		io.set('origins','http://localhost:8100');
		io.set('transports', [
			//'jsonp-polling'
    		'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
		]);
  });
app.listen(8099);

function handler (req, res) {
	var parsed = url.parse(req.url);
	if (parsed.pathname==='/pingjs'){
		//sloppy use of variable declarations
		var callback = _.find( _.map(parsed.query.split('&'),function(s){
			var p = s.split('=');
			return { k:p[0], v:p[1] };
		}), function(s){
			return s.k==='callback'
		});
		console.log(callback);
		res.writeHead(200,{
         'Content-Type': 'application/json',
         //http://devlicio.us/blogs/derik_whittaker/archive/2013/02/10/help-i-am-getting-an-xmlhttprequest-exception-of-access-control-allow-orig.aspx
         // does not work in ff
         'Access-Control-Allow-Origin':'http://localhost:8100',
     	});
     	if (callback){
     		res.end(callback.v+'('+ JSON.stringify({test:'some json'})+')');
     	}else{
	    	res.end(JSON.stringify({test:'some json'}));
     	}
	}else{
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