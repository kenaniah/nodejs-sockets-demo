window.addEventListener('load', function(){

	//Initialize a socket connection
	var socket = io();

	//Initializes the connection
	socket.on('connection', function(socket){

	})

	//Creates the user's sprite
	socket.on('setup', function(data){
		console.log("Setting up my character")

		//Create a DOM element
		var element = document.createElement("DIV")

		//Create the sprite
		var sprite = new Sprite(element, true)
		sprite.setState(data.state)
		Sprite.list[data.id] = sprite

		//Update the classes to display the sprite
		element.className = "sprite transition"
		document.getElementById("sprites").appendChild(element)
	})

})
