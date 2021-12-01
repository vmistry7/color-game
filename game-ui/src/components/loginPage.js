"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;

var Link = ReactRouter.Link;

//Request package
var request = require('request');

var Login = React.createClass ({

	getInitialState : function(){
      return {
        
        	data: {
	         userName : "",
	         password: ""
	     	},
	        message : ""
        };
  	},
  	_setDataState: function(event){
		
		this.setState({message : ""});

		var field = event.target.name;
	 	var value = "";
	 	value = event.target.value;
	 	if(value){
	 		value = value;
	 	}

	 	var key = field;
		this.state.data[key] = value;
	 	
	 	this.setState({data : this.state.data});
	},
	_submit : function(event) {
		event.preventDefault();
		var isSubmit = false;
		if((event.type === "keyup" && event.which === 13) || (event.type === "click")){
    	        isSubmit = true;
    	}
		if(isSubmit)
    	{
    		
	    	this.setState({message : "Validating..."});
			
			var userName = this.state.data.userName.trim();
			var password = this.state.data.password.trim();

			var self = this;

			request({
	          uri: "http://localhost:5001/api/login",
	          method: "POST",
	          form: {
	          	userName: userName,
	          	password: password
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
			              
			             self.setState({message : "Logging in..."});
			             self.props.history.push("/Game");
			              
			          }
			          else {
			              
			              self.setState({message : objBody.message});
			           }
			        }
	  		    });
    	}

	},
	render: function(){

		return (

			<div>
				<p className="text-warning"><b>{this.state.message}</b></p>
				<form>
					<legend className="text-primary"><i className=""></i>Login</legend>
					<fieldset>
						<div className="form-group">
  							<label className="control-label" htmlFor="focusedInput">User Name : </label>
  							<input type="text" className="form-control" ref="userName" id="userName" name="userName" value={this.state.data.userName} onChange={this._setDataState} maxLength="55" placeholder="User name"  />
						</div>
						<div className="form-group">
  							<label className="control-label" htmlFor="focusedInput">Password : </label>
  							<input type="password" className="form-control" ref="password" id="password" name="password" value={this.state.data.password} onChange={this._setDataState} onKeyUp={this._submit}  maxLength="55" placeholder="Password"  />
						</div>
						<div className="form-group">
							<button type="button" id="btnSubmit" className="btn btn-default btn-sm" onClick={this._submit}><span className="fa fa-arrow-circle-left"></span> Log In</button>
                    	</div>
                    </fieldset>
				</form>
			</div>
		);

	},
	componentDidMount: function(){
   		
   		ReactDOM.findDOMNode(this.refs.userName).focus();  

   		$(window).keydown(function(event){
		    if(event.keyCode == 13) {
		      event.preventDefault();
		      return false;
		    }
  		});
	}

});

module.exports = Login;