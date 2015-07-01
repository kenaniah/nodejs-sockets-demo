window.addEventListener('load', function(){

	function createSprite(data, bind_keys){

		//Create a DOM element
		var element = document.createElement("DIV")

		//Create the sprite
		var sprite = new Sprite(element, bind_keys)
		sprite.setState(data.state)
		Sprite.list[data.id] = sprite

		//Update the classes to display the sprite
		element.className = "sprite transition"
		document.getElementById("sprites").appendChild(element)

	}

	//Initialize a socket connection
	var socket = io();

	//Tracks this user's client id
	var client_id = null;

	//Creates the user's sprite
	socket.on('setup', function(data){
		console.log("Setting up my character")

		//Register our client id
		client_id = data.id
		createSprite(data, true)

		//Set up the other sprites
		for(var i = 0; i < data.others.length; i++){
			createSprite(data.others[i], false)
		}

	})

	socket.on("new user", function(data){

		console.log("new user")

		if(data.id == client_id) return;

		//Register a different user
		createSprite(data, false)

	})

})
