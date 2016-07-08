/**
 * Created by californianseabass on 2/17/15.
 */

 var PREFIX = '/photos/';

var express = require('express');
var app = express();

var _ = require('lodash');
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

// Script Globals
var photo_directory = process.argv[2]; //input directory given by launch command
var htmlToFs = {}; // key value of the html file route to the actual location in filesystem

fetch_photos = function(dir, cb) {
  fs.readdir(dir, function(err, files) {
    if (files === undefined) {
      console.error('Error trying to read files from directory: ' + files);
      return
;   }

    var jpg_files = files.filter(f => path.extname(f).toLowerCase() === '.jpg')
      .map(f => {
        htmlToFs[f] = path.join(dir, f);
        const htmlPath = path.join(PREFIX, f);
        return htmlPath;
      });

    const dirs = files.filter(f => fs.lstatSync(path.join(dir, f)).isDirectory());
    const nDirs = dirs.length;
    let nDone = 0;
    let deepFiles1 = [];

    if (nDirs > 0) {
      dirs.forEach(d => fetch_photos(path.join(dir, d), fs => {
        nDone++;
        deepFiles1 = deepFiles1.concat(fs);
        if (nDone === nDirs) {
          cb(jpg_files.concat(deepFiles1));
        }

      }));
    } else {
      cb(jpg_files);
    }
  });
}


var send_photos_to_client = function(directory) {
  fetch_photos(directory, files => io.emit('ls', {'files': files}));
  return;
}

// setup an endpoint for the client to request photos from
app.get(PREFIX +':photo', function(req, res){
    const htmlPath = req.params.photo;
    const fsPath = htmlToFs[htmlPath] ? htmlToFs[htmlPath] : '';
    const sendfile_options = { root: path.dirname(fsPath) };

    if (fs.stat(fsPath, (err, stats) => {
      if (err) {
      res.status(404);
        res.send(err.text);
        return;
      }
      if (stats.isFile()) {
         res.sendFile(fsPath, function (err) {
          if (err) {
            console.log(err);
            res.status(err.status).end();
          }
          else {
            console.log('Sent: ', fsPath);
          }
      });
      } else {
        res.status(404);
        res.send('Could not find requested photo: ' + re.params.photo);
      }
      return;
    }));
});

io.on('connection', function(socket) {
  console.log('Connection established.');

  socket.on('delete', function (data) {
    var path_to_delete = photo_directory + '/' + data.photo.split(PREFIX)[1]
    fs.unlink(path_to_delete, function(e) {
      console.log('deleted: ' + path_to_delete);
    });
  });

  send_photos_to_client(photo_directory);
});
