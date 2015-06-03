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

// var PhotoImg = React.createClass({
//   render : function(){
//     return (
//       <img className="img-responsive" src={this.state.photo} onClick={this.handleRightClick}/>
//     );
//   }
// });

var Photo = React.createClass({
  getInitialState: function() {
    var index = 0;
    socket = io.connect();
    console.log('found connection!');
    socket.on('ls', function(data) {
      photos = data.files;
      var path =  "./dyn_photos/" + photos[index];
      this.setState({photo: path});
    });
    return {photo: photo};
  },
  handleLeftClick: function() {
    if (index > 0) {
      index = index - 1;
    } else {
      index = photos.length;
    }
    this.setState({photo: photos[index]});
  },
  handleRightClick: function() {
    index = (index + 1) % photos.length;
    var photo_path = photos[index];
    console.log(photos);
    this.setState({photo: photo_path});
  },
  render: function() {
    return (
        <div className="carousel-inner">
        <img className="carousel-inner" src={this.state.photo}/>
        <a className="left carousel-control" onClick={this.handleLeftClick}> 
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"> </span>
        </a>
        <a className="right carousel-control"  onClick={this.handleRightClick}> 
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"> </span>
        </a>
        </div>
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
    return {};
  },
  render: function() {
    return (
      <div>
        <Photo />

      </div>
    );
  }
});

React.render(
    <GalleryWindow />,
    document.getElementById('content')
);






