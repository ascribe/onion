'use strict';
/**
 * This component is essentially a port of https://github.com/simplefocus/FlowType.JS
 * to Reactjs in order to not being forced to use jQuery
 *
 * Author: Tim Daubenschütz
 *
 * Thanks to the guys at Simple Focus http://simplefocus.com/
 */

import React from 'react';
import ReactAddons from 'react/addons';

let FlowType = React.createClass({
    propTypes: {

        // standard FlowTypes.JS options
        maximum: React.PropTypes.number,
        minimum: React.PropTypes.number,
        maxFont: React.PropTypes.number,
        minFont: React.PropTypes.number,
        fontRatio: React.PropTypes.number,

        // react specific options
        children: React.PropTypes.element.isRequired // only supporting one child element at once right now
    },

    // Establish default settings/variables
    // ====================================
    getDefaultProps() {
        return {
            maximum: 9999,
            minimum: 1,
            maxFont: 9999,
            minFont: 1,
            fontRatio: 35
        };
    },

    getInitialState() {
        return {
            fontSize: 1
        };
    },

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child) => {
            return ReactAddons.addons.cloneWithProps(child, {
                style: {
                    fontSize: this.state.fontSize
                }
            });       
        });
    },

    render() {
        return (
            <span>
                {this.renderChildren()}
            </span>
        );
    }
});

export default FlowType;