'use strict';

import React from 'react';

let AccordionListItemTableToggle = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        onClick: React.PropTypes.func,
        show: React.PropTypes.bool
    },

    render() {
        return (
            <span
                className={this.props.className}
                onClick={this.props.onClick}>
                {this.props.show ? 'Hide all Editions' : 'Show all Editions'}
            </span>
        );
    }
});

export default AccordionListItemTableToggle;