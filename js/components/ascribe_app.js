import React from 'react';
import Router from 'react-router';


var Link = Router.Link;
var RouteHandler = Router.RouteHandler;


class AscribeApp extends React.Component {
    render() {
        return (
            <div>
                <header>ascribe</header>
                <navigation>
                    <Link to="artworks">artworks</Link>
                </navigation>
                <RouteHandler />
            </div> 
        );
    }
};

export default AscribeApp;
