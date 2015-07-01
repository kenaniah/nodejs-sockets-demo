// Tracks a list of all sprites
Sprite.list = {}

/**
 * Class to manage sprites
 *
 * This class is used by both the browser and back-end.
 *
 * Sprites will emit a "change" event when their state is changed
 * through its public methods.
 *
 * The entire state of a sprite can be accessed via getState()
 *
 * Passing a state into setState() will cause the sprite to match
 * that state without firing the change event.
 */
function Sprite(element, character_idx){

	//A hack to adjust image headings for broken chars
	var _adjustImageIndexes = [3, 4, 6]

    var self = this

	//Track a state object
	var character_state = {

		//Tracks which character we're displaying
		spriteIndex: character_idx || 0

	}

    //Tracks the window interval for animation
    var animateInterval;

    //Which frame number we are in (3 frames total)
    var frame = 0

    //Tracks which set of sprites to animate
    var offsetX = 0
    var offsetY = 0

    //Track the offset for which way the character is facing
    var dirOffset = 0;

    /**
     * Moves to the sprite's next animation frame
     */
    function nextFrame(){

        //Loop the frame count
        frame++
        if(frame >= 3){
            frame = 0
        }

        //Redraw the character
        redraw();

    }

    /**
     * Redraws the character frame
     */
    function redraw(){

		//Bump certain sprites up a few pixels if not facing down
		hack_adj = 0
		if(_adjustImageIndexes.indexOf(character_state.spriteIndex) != -1 && dirOffset > 0){
			hack_adj = -1
		}

		if(element){
        	element.style.backgroundPositionX = -(offsetX + frame * 32) + "px"
        	element.style.backgroundPositionY = -(offsetY + dirOffset) + hack_adj + "px"
		}

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
                self.face(key)
                self.move(key)
                keyboardEvent.preventDefault()
                break;

            //aswd mappings
            case "u+0041": //a
                self.face('left')
                self.move('left')
				keyboardEvent.preventDefault()
                break;
            case "u+0053": //s
                self.face('down')
                self.move('down')
				keyboardEvent.preventDefault()
                break;
            case "u+0057": //w
                self.face('up')
                self.move('up')
				keyboardEvent.preventDefault()
                break;
            case "u+0044": //d
                self.face('right')
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
    window.addEventListener('keydown', keyHandler);

    /**
     * Changes the direction the character is facing
     */
    this.face = function(direction){

        switch(direction){
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

        redraw();

    }

    /**
     * Moves the character in a certain direction
     */
    this.move = function(direction, distance_pixels){

        //How many pixels to travel?
        var distance = distance_pixels || 16;

        //Where is the character currently?
        var left = parseInt(element.style.left) || 0
        var top = parseInt(element.style.top) || 0

        switch(direction){
            case "left":
                left -= distance
                break;
            case "up":
                top -= distance
                break;
            case "right":
                left += distance
                break;
            case "down":
                top += distance
                break;
        }

        //Move the character
		if(element){
        	element.style.left = left + "px"
        	element.style.top = top + "px"
		}

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

        //Move the background image to the new characters
        offsetX = (character_state.spriteIndex % 4) * 96
        offsetY = Math.floor(character_state.spriteIndex / 4) * 128

        redraw();

    }

    /**
     * Enables / disables animation
     */
    this.animate = function(){

        if(animateInterval){
            window.clearInterval(animateInterval)
            animateInterval = null
        }else{
            animateInterval = window.setInterval(nextFrame, 400)
        }

        //Force animation to start?
        if(arguments.length && arguments[0] && !animateInterval){
            animateInterval = window.setInterval(nextFrame, 400)
        }

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
