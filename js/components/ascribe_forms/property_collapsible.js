'use strict';

import React from 'react';

import CollapsibleMixin from 'react-bootstrap/lib/CollapsibleMixin';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import classNames from 'classnames';


let PropertyCollapsile = React.createClass({
    propTypes: {
        children: React.PropTypes.arrayOf(React.PropTypes.element),
        checkboxLabel: React.PropTypes.string,
        tooltip: React.PropTypes.string
    },

    mixins: [CollapsibleMixin],

    getInitialState() {
        return {
            show: false
        };
    },

    getCollapsibleDOMNode(){
        return React.findDOMNode(this.refs.panel);
    },

    getCollapsibleDimensionValue(){
        return React.findDOMNode(this.refs.panel).scrollHeight;
    },

    handleFocus() {
        this.refs.checkboxCollapsible.getDOMNode().checked = !this.refs.checkboxCollapsible.getDOMNode().checked;
        this.setState({
            show: this.refs.checkboxCollapsible.getDOMNode().checked
        });
    },

    renderChildren() {
        if(this.state.show) {
            return (<div
                        className={classNames(this.getCollapsibleClassSet()) + ' ascribe-settings-property'}
                        ref="panel">
                            {this.props.children}
                    </div>);
        } else {
            return null;
        }
    },

    render() {
        let tooltip = <span/>;
        if (this.props.tooltip){
            tooltip = (
                <Tooltip>
                    {this.props.tooltip}
                </Tooltip>);
        }

        let style = this.state.show ? {} : {paddingBottom: 0};

        return (
            <div
                className={'ascribe-settings-wrapper'}
                style={style}>
                <OverlayTrigger
                    delay={500}
                    placement="top"
                    overlay={tooltip}>
                    <div
                        className="ascribe-settings-property-collapsible-toggle"
                        onClick={this.handleFocus}
                        onFocus={this.handleFocus}>
                        <input
                            type="checkbox"
                            ref="checkboxCollapsible"/>
                        {/* PLEASE LEAVE THE SPACE BETWEEN LABEL and this.props.label */}
                        <span className="checkbox"> {this.props.checkboxLabel}</span>
                    </div>
                </OverlayTrigger>
                {this.renderChildren()}
            </div>
        );
    }
});

export default PropertyCollapsile;