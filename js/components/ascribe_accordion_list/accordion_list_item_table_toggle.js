'use strict';

import React from 'react';
import { getLangText } from '../../utils/lang_utils.js';


let AccordionListItemTableToggle = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        onClick: React.PropTypes.func,
        message: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ])
    },

    render() {
        return (
            <span
                className={this.props.className}
                onClick={this.props.onClick}>
                {this.props.message}
            </span>
        );
    }
});

export default AccordionListItemTableToggle;
