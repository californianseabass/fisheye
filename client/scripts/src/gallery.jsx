'use strict';

// web socket code
// var socket = io.connect();
// socket.on('ls', function(data) {
//   console.log(data.files);
// });


var photos = [
  'DSC07647.JPG'
];
var index = 0;
var socket;
var photo =  "./photos/DSC07647.JPG";

console.log('test')

var Photo = React.createClass({
  getInitialState: function() {
    var index = 0;
    socket = io.connect();
    socket.on('ls', function(data) {
      photos = data.files;
      var path =  "./dyn_photos/" + photos[index];
      this.setState({photo: path});
    });
    return {photo: photo};
  },
  handleClick: function() {
    index = (index + 1) % photos.length;
    var photo_path = photos[index];
    console.log(photos);
    this.setState({photo: photo_path});
  },
  render: function() {
    return (
        <img className="img-responsive" src={this.state.photo} onClick={this.handleClick}/>
    );
  }
});

/**
 * Properties:
 * - List of Photos to display
 * -
 */
var GalleryWindow = React.createClass({
  getInitialState: function() {
    var index = 0;
  },
  render: function() {
    return;
  }
});

React.render(
    <Photo />,
    document.getElementById('content')
);






