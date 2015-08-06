'use strict';

import React from 'react';


let ActionPanel = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        content: React.PropTypes.string,
        buttons: React.PropTypes.element,
        onClick: React.PropTypes.func,
        ignoreFocus: React.PropTypes.bool
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

        this.refs.input.getDOMNode().focus();
        this.setState({
            isFocused: true
        });
    },

    getClassName() {
        if(this.state.isFocused) {
            return 'is-focused';
        } else {
            return '';
        }
    },

    render() {

        return (
            <div
                className={'ascribe-panel-wrapper ' + this.getClassName()}
                onClick={this.handleFocus}
                onFocus={this.handleFocus}>
                <div className='ascribe-panel-title'>
                    {this.props.title}
                </div>
                <div className='ascribe-panel-content-wrapper'>
                    <span className="ascribe-panel-content pull-left">
                        {this.props.content}
                    </span>
                    <span className='ascribe-panel-buttons pull-right'>
                        {this.props.buttons}
                    </span>
                </div>
            </div>
        );
    }
});

export default ActionPanel;