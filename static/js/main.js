window.addEventListener('load', function(){

	function createSprite(data, bind_keys){

		//Create a DOM element
		var element = document.createElement("DIV")
		element.id = data.id

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

		//Create our sprite
		createSprite(data, true)

		//Set up the other sprites
		for(var i = 0; i < data.others.length; i++){
			createSprite(data.others[i], false)
		}

	})

	//Shows the sprite for a user that just joined
	socket.on("new user", function(data){

		//Create another user's sprite
		createSprite(data, false)

	})

	//Remove a user on disconnect
	socket.on("remove user", function(data){

		//Remove their sprite from the dom
		var element = document.getElementById(data.id)
		element.parentNode.removeChild(element)

		//Delete the sprite
		delete Sprite.list[data.id]

	})

})
