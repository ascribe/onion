'use strict';

import React from 'react';

let AccordionList = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
        loadingElement: React.PropTypes.element
    },
    
    render() {
        if(this.props.itemList && this.props.itemList.length > 0) {
            return (
                <div className={this.props.className}>
                    {this.props.children}
                </div>
            );
        } else if(this.props.itemList.length === 0) {
            return (
                <div>
                    <p className="text-center">You don't have any works yet...</p>
                    <p className="text-center">To register one, click <a href="register_piece">here</a>!</p>
                </div>
            );
        } else {
            return (
                <div className={this.props.className + ' ascribe-accordion-list-loading'}>
                    {this.props.loadingElement}
                </div>
            );
        }
    }
});

export default AccordionList;