"use strict";

var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var Route = ReactRouter.Route;

var routes = (
	<Route path="/" component={require('./components/app')}>
		<IndexRoute components={{main: require('./components/loginPage')}}  />
		<Route path="/Game" components={{main: require('./components/gamePage')}}/>
		<Route path="/Test" components={{main: require('./components/testPage')}}/>
		<Route path="*" components={{main: require('./components/notFoundPage')}}/>
	</Route>
);

module.exports = routes;
