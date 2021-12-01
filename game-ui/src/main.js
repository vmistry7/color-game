"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;

var routes = require('./routes');

var createBrowserHistory = require('history/lib/createBrowserHistory');
var history = createBrowserHistory();

ReactDOM.render(<Router routes={routes} history={history} />, document.getElementById('app'));



