//Initialize the sprite(s) on load
window.addEventListener('load', function(){

    var elements = document.getElementsByClassName("sprite")
    for(var i = 0; i < elements.length; i++){
		var id = elements[i].id
        Sprite.list[id] = new Sprite(elements[i], (i * 3) % 8 )
		Sprite.list[id].animate(true)
    }

})
