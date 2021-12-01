"use strict";

var React = require('react');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;

var Link = ReactRouter.Link;

//Request package
var request = require('request');


var Game = React.createClass({

	getInitialState : function(){
      return {
        
        	data: {
	         	
	         	id: -1, 
				name: "Guest user", 
				wins: 0, 
				losses: 0, 
				rgbs :["red", "grey", "green", "blue", "black", "pink"],
				answer: "pink", 
				won: false,
				sfDateTime: "SF Date-Time",
				nyDateTime:	"NY Date-Time"

	     	},
	        message : ""
        };
  	},
  	_submit : function(event) {

  		var key = event.target.name;
  		var value = this.state.data.rgbs[key];

		
		var id = this.state.data.id;
		var won = false;
	 	if(value == this.state.data.answer){
	 		console.log("Passed.");
	 		won = true;
	 		this.setState({message : "Won!"});
	 	}
	 	else {
	 		won = false;
	 		this.setState({message : "Lost!"});
	 	}


	 	this.setState({message : "Loading..."});
	 	var self = this;
		request({
	      	  uri: "http://localhost:5001/api/game",
		      method: "POST",
		      form: {
		      	id: id,
		      	won: won
		      },
		      json: true,
		      timeout: 30000,
		      followRedirect: false,
		      maxRedirects: 10
		    }, function(err, httpResponse, body) {
			        
			        self.setState({message : ""});	

			        if (err) 
			        {
			        	console.log(err);
			            self.setState({message : "Internal error while retriving data!"});
			        }
			        else
			        {
			          var strBody = JSON.stringify(body);
			          var objBody = JSON.parse(strBody);
			          if(httpResponse.statusCode === 200) {
			              
			             self._getGameData();
			              
			          }
			          else {
			              
			              self.setState({message : objBody.message});
			           }
			        }
		});

  	},
	_getGameData: function(){

		var self = this;
  		request({
	          uri: "http://localhost:5001/api/game",
	          method: "GET",
	          json: true,
	          timeout: 30000,
	          followRedirect: false,
	          maxRedirects: 10
	        }, function(err, httpResponse, body) {
			        
			        self.setState({message : ""});	

			        if (err) 
			        {
			        	console.log(err);
			            self.setState({message : "Internal error while retriving data!"});
			        }
			        else
			        {
			          var strBody = JSON.stringify(body);
			          var objBody = JSON.parse(strBody);
			          if(httpResponse.statusCode === 200) {
			              
			              self.setState({data : objBody});
			          }
			          else {
			              
			              self.setState({message : objBody.message});
			           }
			        }
	  	});

	},
	_logout: function(){

		var self = this;
		self.setState({message : "Logging out..."});
  		request({
	          uri: "http://localhost:5001/api/logout",
	          method: "GET",
	          json: true,
	          timeout: 30000,
	          followRedirect: false,
	          maxRedirects: 10
	        }, function(err, httpResponse, body) {
			        
			        self.setState({message : ""});	

			        if (err) 
			        {
			        	console.log(err);
			            self.setState({message : "Internal error while retriving data!"});
			        }
			        else
			        {
			          var strBody = JSON.stringify(body);
			          var objBody = JSON.parse(strBody);
			          if(httpResponse.statusCode === 200) {
			              
			              self.props.history.push("/");
			          }
			          else {
			              
			              self.setState({message : objBody.message});
			           }
			        }
	  	});

	},
	render: function(){
		return (
			<div>
				<h2>Welcome, {this.state.data.name}</h2>
				<h3>Win:{this.state.data.wins}&nbsp;Losses:{this.state.data.losses}</h3>
				<h4 className="text-info"><strong>{this.state.message}</strong></h4>
				<div className="container-fluid">
					<div className="row">
						<button type="button" id="btn1" name="0" onClick={this._submit} className="col-md-6" style={{"height" : "75px", "backgroundColor" : this.state.data.rgbs[0]}}></button>
						<button type="button" id="btn2" name="1" onClick={this._submit} className="col-md-6" style={{"height" : "75px", "backgroundColor" : this.state.data.rgbs[1]}}></button>
					</div>
					<div className="row">
						<button type="button" id="btn3" name="2" onClick={this._submit} className="col-md-3" style={{"height" : "150px", "backgroundColor" : this.state.data.rgbs[2]}}></button>
						<button type="button" id="btnAnswer" className="col-md-6" style={{"height" : "150px", "backgroundColor" : this.state.data.answer, "pointerEvents": "none"}}>
							Find this color.
						</button>
						<button type="button" id="btn4" name="3" onClick={this._submit} className="col-md-3" style={{"height" : "150px", "backgroundColor" : this.state.data.rgbs[3]}}></button>
					</div>
					<div className="row">
						<button type="button" id="btn5" name="4" onClick={this._submit} className="col-md-6" style={{"height" : "75px", "backgroundColor" : this.state.data.rgbs[4]}}></button>
						<button type="button" id="btn6" name="5" onClick={this._submit} className="col-md-6" style={{"height" : "75px", "backgroundColor" : this.state.data.rgbs[5]}}></button>
					</div>
				</div>
				<div>
					<div>
						<div style= {{"marginTop" : "10px"}}>
							San Francisco Time. {this.state.data.sfDateTime}
						</div>
					</div>
				</div>
				<div>
					<br />
					<br />
					<button type="button" id="btnSubmit" className="btn btn-danger btn-sm" onClick={this._logout}><span className="fa fa-arrow-circle-left"></span> Log Out</button>
				</div>
			</div>
		);
	},
	componentDidMount: function(){
   		
   		$(window).keydown(function(event){
		    if(event.keyCode == 13) {
		      event.preventDefault();
		      return false;
		    }
  		});

  		this._getGameData();

   		
	}
});

module.exports = Game;