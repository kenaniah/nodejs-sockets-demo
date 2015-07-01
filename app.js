var express = require('express')
var app = express()
var http = require('http').Server(app)
var port = process.env.PORT || 3000

// Instruct express to serve the static directory
app.use(express.static("static"))

// Launch the HTTP server
http.listen(port, function(){
	console.log("Listening on port: " + port)
})
