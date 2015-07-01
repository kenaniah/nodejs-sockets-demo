// Tracks a list of all sprites
Sprite.list = {}

/**
 * Class to manage sprites
 *
 * This class is used by both the browser and back-end.
 *
 * Sprites will emit a "sprite-changed" event when their state is changed
 * through its public methods.
 *
 * The entire state of a sprite can be accessed via getState()
 *
 * Passing a state into setState() will cause the sprite to match
 * that state without firing the sprite-changed event.
 */
function Sprite(element, bind_keys){

	//A hack to adjust image headings for broken chars
	var _adjustImageIndexes = [3, 4, 6]

    var self = this

	//Track a state object
	var character_state = {

		//Tracks which character we're displaying
		spriteIndex: 0,

		//Tracks which direction the character is facing
		facing: "down",

		//Whether animation is enabled on this character
		animate: true,

		//Current location from top and left
		x: 0,
		y: 0

	}

    //Tracks the window interval for animation
    var animateInterval;

    //Which frame number we are in (3 frames total)
    var frame = 0

    /**
     * Moves to the sprite's next animation frame
     */
    function nextFrame(){

        //Loop the frame count
        frame++
        if(frame >= 3){
            frame = 0
        }

        redraw()

    }

    /**
     * Redraws the character frame
     */
    function redraw(){

		if(!element) return;

		//HACK - Always animate only the sprite that's controlled
		character_state.animate = !!bind_keys

		//Track animation
		if(character_state.animate && !animateInterval){
            animateInterval = window.setInterval(nextFrame, 400)
        }else if(!character_state.animate && animateInterval){
			window.clearInterval(animateInterval)
            animateInterval = null
        }

		//Determine which direction the character is facing
		var dirOffset = 0;
		switch(character_state.facing){
            case "left":
                dirOffset = 32;
                break;
            case "up":
                dirOffset = 96;
                break;
            case "right":
                dirOffset = 64;
                break;
            case "down":
                dirOffset = 0;
                break;
        }

		//Bump certain sprites up a few pixels if not facing down
		hack_adj = 0
		if(_adjustImageIndexes.indexOf(character_state.spriteIndex) != -1 && dirOffset > 0){
			hack_adj = -1
		}

		//Move the background image to the current character
        var offsetX = (character_state.spriteIndex % 4) * 96
        var offsetY = Math.floor(character_state.spriteIndex / 4) * 128

		//Move the character
		element.style.left = character_state.x + "px"
		element.style.top = character_state.y + "px"

		//Redraw the character
    	element.style.backgroundPositionX = -(offsetX + frame * 32) + "px"
    	element.style.backgroundPositionY = -(offsetY + dirOffset) + hack_adj + "px"

    }

    /**
     * Handles keyboard events and dispatches them
     */
    function keyHandler(keyboardEvent){

        key = keyboardEvent.keyIdentifier.toLowerCase()

        switch(key){

            //Normal motions
            case "up":
            case "down":
            case "left":
            case "right":
                self.face(key, true)
                self.move(key)
                keyboardEvent.preventDefault()
                break;

            //aswd mappings
            case "u+0041": //a
                self.face('left', true)
                self.move('left')
				keyboardEvent.preventDefault()
                break;
            case "u+0053": //s
                self.face('down', true)
                self.move('down')
				keyboardEvent.preventDefault()
                break;
            case "u+0057": //w
                self.face('up', true)
                self.move('up')
				keyboardEvent.preventDefault()
                break;
            case "u+0044": //d
                self.face('right', true)
                self.move('right')
				keyboardEvent.preventDefault()
                break;

            //Change directions
            case "u+004a": //j
                self.face('left')
				keyboardEvent.preventDefault()
                break;
            case "u+0049": //i
                self.face('up')
				keyboardEvent.preventDefault()
                break;
            case "u+004b": //k
                self.face('down')
				keyboardEvent.preventDefault()
                break;
            case "u+004c": //l
                self.face('right')
				keyboardEvent.preventDefault()
                break;

            //Change characters
            case "enter":
                self.changeCharacter()
				keyboardEvent.preventDefault()
                break;

            //Start / stop animation
            case "u+0020":
                self.animate()
				keyboardEvent.preventDefault()
                break;
        }
    }

    //Bind the keyboard events
	if(bind_keys){
    	window.addEventListener('keydown', keyHandler);
	}

    /**
     * Changes the direction the character is facing
     */
    this.face = function(direction, prevent_dispatch){

        character_state.facing = direction
		if(!prevent_dispatch){
			dispatchEvent()
        	redraw()
		}

    }

    /**
     * Moves the character in a certain direction
     */
    this.move = function(direction, distance_pixels){

        //How many pixels to travel?
        var distance = distance_pixels || 16;

        //Move the character
        switch(direction){
            case "left":
                character_state.x -= distance
                break;
            case "up":
                character_state.y -= distance
                break;
            case "right":
                character_state.x += distance
                break;
            case "down":
                character_state.y += distance
                break;
        }

		dispatchEvent()
		redraw()

    }

    /**
     * Changes the character to a new character
     */
    this.changeCharacter = function(character_idx){

        //Set the new index
        if(character_idx === undefined){
            character_state.spriteIndex++
        }else{
            character_state.spriteIndex = character_idx
        }

        //Loop the index if needed
        if(character_state.spriteIndex >= 8){
            character_state.spriteIndex = 0
        }

		dispatchEvent()
        redraw()

    }

    /**
     * Enables / disables animation
     */
    this.animate = function(enabled){

		//Determine whether to enable or disable animation
		if(typeof enabled == "undefined"){
			//Toggle it
			enabled = !character_state.animate
		}
		character_state.animate = !!enabled

		dispatchEvent()
		redraw()

    }

	/**
	 * Dispatches a sprite-changed event when the sprite is
	 * changed from anything but setState()
	 */
	function dispatchEvent(){

		if(!element) return

		var event = new CustomEvent('sprite-changed', {
			bubbles: true,
			detail: self.getState()
		})

		element.dispatchEvent(event)

	}


	/**
	 * Returns the current state of the sprite
	 */
	this.getState = function(){
		return character_state
	}

	/**
	 * Sets the current state of the sprite (without firing chage)
	 */
	this.setState = function(state){
		character_state = state
		redraw()
	}

    /**
     * Returns a reference to the DOM for the sprite
     */
    this.getElement = function(){
        return element
    }

}

// Expose this as a node module
if(typeof module === 'undefined') module = {}
module.exports = Sprite
