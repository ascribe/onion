import React from 'react';
import Router from 'react-router';


let Link = Router.Link;
let RouteHandler = Router.RouteHandler;


let AscribeApp = React.createClass({
    render() {
        return (
            <div>
                <header>ascribe</header>
                <navigation>
                    <Link to="pieces">pieces</Link>
                </navigation>
                <RouteHandler />
            </div> 
        );
    }
});

export default AscribeApp;
