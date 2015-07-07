'use strict';

import React from 'react';

let CollapsibleButton = React.createClass({

    propTypes: {
        panel: React.PropTypes.object,
        button: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    getInitialState() {
        return {expanded: false};
    },
    handleToggle(e){
        e.preventDefault();
        this.setState({expanded: !this.state.expanded});
    },
    render() {
        let isVisible = (this.state.expanded) ? '' : 'invisible';
        return (
            <span>
                <span onClick={this.handleToggle}>
                    {this.props.button}
                </span>
                <div ref='panel' className={isVisible}>
                    {this.props.panel}
                </div>
            </span>
        );
    }
});

export default CollapsibleButton;
