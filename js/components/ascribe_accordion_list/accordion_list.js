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