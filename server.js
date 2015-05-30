/**
 * Created by californianseabass on 2/17/15.
 */

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


var directory = '/Volumes/Untitled/DCIM/100MSDCF/';

app.get('/dyn_photos/:photo', function(req, res){
    var pid = req.params.photo;
    console.log(pid);

    var abs_path = '/Volumes/Untitled/DCIM/100MSDCF/' + pid;
    res.sendfile(abs_path);
});

io.on('connection', function(socket) {
	fs.readdir(directory, function(err, files) {
		if (files === undefined) {
			console.log('Error trying to read files from directory: ' + files);
			return;
		}
		var filtered_files = files.filter(function(file) {
			console.log(file);
			console.log(file.search(/._/));
			return path.extname(file).toLowerCase() === '.jpg' && (file.search(/._/) === -1);
		});
		// console.log(filterefiles)
		files = filtered_files.map(function(file) {
			return path.join('/dyn_photos/', file);
		});
		console.log(files);
		io.emit('ls', {'files': files});
	 	return;
	});
});