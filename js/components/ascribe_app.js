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
                <nav>
                    <Link to="pieces">pieces</Link>
                </nav>
                <RouteHandler />
            </div> 
        );
    }
});

export default AscribeApp;
