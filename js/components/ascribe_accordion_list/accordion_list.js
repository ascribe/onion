'use strict';

import React from 'react';


let AccordionList = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
    },
    
    render() {
        if(this.props.itemList && this.props.itemList.length > 0) {
            return (
                <div className={this.props.className}>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <p>Loading</p>
            );
        }
    }
});

export default AccordionList;