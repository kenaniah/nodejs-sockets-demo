// Load the express framework
var express = require('express')
var app = express()
var server = require('http').Server(app)
var port = process.env.PORT || 3000
var uuid = require('uuid')

// Load the client Sprite API
var Sprite = require('./static/js/animate.js')

// Tie socket.io into the web server
var io = require('socket.io')(server)

// Handle socket connections
io.on('connection', function(socket){

	var client_id = uuid.v1()
	console.log("Connecting client. Assigning as: " + client_id)

	Sprite.list[client_id] = Sprite.new(null, Math.floor(Math.random() * 8))

})

// Instruct express to serve the static/ directory
app.use(express.static("static"))

// Launch the HTTP server
server.listen(port, function(){
	console.log("Listening on port: " + port)
})
