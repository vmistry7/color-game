"use strict";

var React = require('react');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;

var Link = ReactRouter.Link;

var TestPage = React.createClass({

	render: function(){
		return (
			<div>
				<h1>Test Page</h1>
				<p><Link to="/">Back to Home</Link></p>
			</div>
		);
	}
});

module.exports = TestPage;