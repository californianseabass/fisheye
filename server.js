/**
 * Created by californianseabass on 2/17/15.
 */

 var PREFIX = '/dyn_photos/';

var express = require('express');
var app = express();

var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var url = require('url');

app.set('port', (process.env.PORT || 8001));

app.use('/', express.static(path.join(__dirname, 'client')));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

if (process.argv.length < 3) {
	console.log('node server.js $DIRNAME');
	process.exit(-1);
}


var photo_directory = process.argv[2];

var fetch_photos = function(directory) {
	fs.readdir(directory, function(err, files) {
		if (files === undefined) {
			console.log('Error trying to read files from directory: ' + files);
			return;
		}
		var filtered_files = files.filter(function(file) {
			return path.extname(file).toLowerCase() === '.jpg' && (file.search(/._/) === -1);
		});
		files = filtered_files.map(function(file) {
			return path.join(PREFIX, file);
		});
		io.emit('ls', {'files': files});
	 	return;
	});
}

// setup an endpoint for the client to request photos from
app.get(PREFIX +':photo', function(req, res){
    var filename = req.params.photo;

    var sendfile_options = {
    	root: photo_directory
    };
    res.sendFile(filename, sendfile_options, function (err) {
	    if (err) {
	      console.log(err);
	      res.status(err.status).end();
	    }
	    else {
	      console.log('Sent: ', filename);
	    }
	  });
});

io.on('connection', function(socket) {
	console.log('Connecting established.');

	socket.on('delete', function (data) {
		var path_to_delete = photo_directory + '/' + data.photo.split(PREFIX)[1]
		fs.unlink(path_to_delete, function(e) {
			console.log('deleted: ' + path_to_delete);
		});
  });

	fs.readdir(photo_directory, function(err, files) {
		if (files === undefined) {
			console.log('Error trying to read files from directory: ' + files);
			return;
		}
		var filtered_files = files.filter(function(file) {
			return path.extname(file).toLowerCase() === '.jpg' && (file.search(/._/) === -1);
		});
		files = filtered_files.map(function(file) {
			return path.join(PREFIX, file);
		});
		io.emit('ls', {'files': files});
	 	return;
	});
});