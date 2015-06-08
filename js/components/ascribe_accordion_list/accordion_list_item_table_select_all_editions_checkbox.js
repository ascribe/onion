'use strict';

import React from 'react';


let AccordionListItemTableSelectAllEditionsCheckbox = React.createClass({
    
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        numOfSelectedEditions: React.PropTypes.number.isRequired,
        numOfAllEditions: React.PropTypes.number.isRequired
    },

    onChange() {
        let checked = this.props.numOfAllEditions === this.props.numOfSelectedEditions;
        this.props.onChange(checked);
    },

    render() {
        return (
            <input type="checkbox"
                onChange={this.onChange}
                checked={this.props.numOfAllEditions === this.props.numOfSelectedEditions} />
        );
    }
});

export default AccordionListItemTableSelectAllEditionsCheckbox;