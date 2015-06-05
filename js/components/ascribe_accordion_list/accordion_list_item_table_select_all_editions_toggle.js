'use strict';

import React from 'react';


let AccordionListItemTableSelectAllEditionsToggle = React.createClass({
    
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        numOfSelectedEditions: React.PropTypes.number.isRequired,
        numOfAllEditions: React.PropTypes.number.isRequired
    },

    render() {
        return (
            <input type="checkbox"
                onChange={this.props.onChange}
                checked={this.props.numOfAllEditions === this.props.numOfSelectedEditions} />
        );
    }
});

export default AccordionListItemTableSelectAllEditionsToggle;