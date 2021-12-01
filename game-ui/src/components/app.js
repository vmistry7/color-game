//"use strict";

var React = require('react');
$ = jQuery = require('jquery');

require('bootstrap');


var App = React.createClass({

	render: function(){

		return (

			<div className="container-fluid">
				{this.props.main}
			</div>
		);		

	}
});

module.exports = App;