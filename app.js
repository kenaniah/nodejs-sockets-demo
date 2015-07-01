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

	//Create a new sprite for the new user
	var sprite = new Sprite;

	//Randomize the sprite a bit
	var state = sprite.getState()
	state.spriteIndex = Math.floor(Math.random() * 8)
	state.x = Math.floor(Math.random() * 40) * 16
	state.y = Math.floor(Math.random() * 10) * 16
	sprite.setState(state)
	console.log("Client's state is: ", state)

	//Get a list of the other sockets
	others = []
	Object.keys(Sprite.list).forEach(function(id){
		others.push({id: id, state: Sprite.list[id].getState()})
	})

	//Keep track of it
	Sprite.list[client_id] = sprite

	//Notify the client of its new state
	socket.emit("setup", {
		id: client_id,
		state: state,
		others: others
	})

	//Join the main room
	socket.join('all')

	//Broadcast to others
	socket.broadcast.to('all').emit("new user", {
		id: client_id,
		state: state
	})

})

// Instruct express to serve the static/ directory
app.use(express.static("static"))

// Launch the HTTP server
server.listen(port, function(){
	console.log("Listening on port: " + port)
})
