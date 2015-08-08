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
    var socketConnectionCallback = function (data) {
      photos = data.files;
      this.setState({ photo: photos[index] });
    }
    socket.on('ls', socketConnectionCallback.bind(this));
    return {photo: photo};
  },
  handleLeftClick: function() {
    if (index > 0) {
      index = index - 1;
    } else {
      index = photos.length - 1;
    }
    this.setState({photo: photos[index]});
  },
  handleRightClick: function() {
    index = (index + 1) % photos.length;
    var photo_path = photos[index];
    this.setState({photo: photo_path});
  },
  handleDelete: function() {
    // TODO: off by one error if last photo is deleted
    socket.emit('delete', {photo: photos[index]});
    photos.splice(index, 1);
    this.setState({photo: photos[index]});
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
        <a className="something">
          <span className="glyphicon glyphicon-trash" onClick={this.handleDelete}> </span>
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






