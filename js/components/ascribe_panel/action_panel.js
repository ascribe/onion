'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';


let ActionPanel = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        content: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        buttons: React.PropTypes.element,
        onClick: React.PropTypes.func,
        ignoreFocus: React.PropTypes.bool,

        leftColumnWidth: React.PropTypes.string,
        rightColumnWidth: React.PropTypes.string
    },

    getInitialState() {
        return {
            isFocused: false
        };
    },

    handleFocus() {
        // if ignoreFocus (bool) is defined, then just ignore focusing on
        // the property and input
        if(this.props.ignoreFocus) {
            return;
        }

        // if onClick is defined from the outside,
        // just call it
        if(this.props.onClick) {
            this.props.onClick();
        }

        ReactDOM.findDOMNode(this.refs.input).focus();
        this.setState({
            isFocused: true
        });
    },

    render() {

        let { leftColumnWidth, rightColumnWidth } = this.props;

        return (
            <div className={classnames('ascribe-panel-wrapper', {'is-focused': this.state.isFocused})}>
                <div
                    className="ascribe-panel-table"
                    style={{width: leftColumnWidth}}>
                    <div className="ascribe-panel-content">
                        {this.props.content}
                    </div>
                </div>
                <div
                    className="ascribe-panel-table"
                    style={{width: rightColumnWidth}}>
                    <div className="ascribe-panel-content">
                        {this.props.buttons}
                    </div>
                </div>
            </div>
        );
    }
});

export default ActionPanel;
