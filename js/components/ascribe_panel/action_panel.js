'use strict';

import React from 'react';


let ActionPanel = React.createClass({
    propTypes: {
        buttons: React.PropTypes.element,
        content: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        leftColumnWidth: React.PropTypes.string,
        onClick: React.PropTypes.func,
        rightColumnWidth: React.PropTypes.string
    },

    render() {
        const { buttons, content, leftColumnWidth, onClick, rightColumnWidth } = this.props;

        return (
            <div
                className={'ascribe-panel-wrapper'}
                onClick={onClick}>
                <div
                    className="ascribe-panel-table"
                    style={{width: leftColumnWidth}}>
                    <div className="ascribe-panel-content">
                        {content}
                    </div>
                </div>
                <div
                    className="ascribe-panel-table"
                    style={{width: rightColumnWidth}}>
                    <div className="ascribe-panel-content">
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
});

export default ActionPanel;
