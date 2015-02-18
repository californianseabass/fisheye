
'use strict';

var photos = [
  {name: 'DSC00944.JPG'},
  {name: 'DSC01131.JPG'}
];

var Photo = React.createClass({
  render: function() {
    return (
        <img className="img-responsive" src="./photos/DSC01131.JPG"/>
    );
  }
});

/**
 * Properties:
 * - List of Photos to display
 * -
 */
var GalleryWindow = React.createClass({
  render: function() {

    return;
  }
});

React.render(
    <Photo />,
    document.getElementById('content')
);






