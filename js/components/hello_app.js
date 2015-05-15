import React from 'react';
import Router from 'react-router';

var RouteHandler = Router.RouteHandler;

class HelloApp extends React.Component {
    render () {
        return (
        	<div>
        		<h1>ascribe all the things!</h1>
        		<RouteHandler/>
        	</div> 
        );
    }
};

export default HelloApp;
