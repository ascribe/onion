import React from 'react';
import Router from 'react-router';
import Header from '../components/header';

let Link = Router.Link;
let RouteHandler = Router.RouteHandler;


let AscribeApp = React.createClass({
    render() {
        return (
            <div>
                <Header />
                <navigation>
                    <Link to="pieces">pieces</Link>
                </navigation>
                <RouteHandler />
            </div> 
        );
    }
});

export default AscribeApp;
