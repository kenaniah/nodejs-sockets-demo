var express = require('express')
var app = express()
var server = require('http').Server(app)
var port = process.env.PORT || 3000

// Tie socket.io into the web server
//var io = require('socket.io')(server)

// Instruct express to serve the static/ directory
app.use(express.static("static"))

// Launch the HTTP server
server.listen(port, function(){
	console.log("Listening on port: " + port)
})
