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
            // 32 because that's the default font display size
            // doesn't really matter though
            fontSize: 0
        };
    },

    componentDidMount() {
        // Make changes upon resize, calculate changes and rerender
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount() {
        // stop listening to window once the component was unmounted
        window.removeEventListener('resize', this.handleResize);
    },

    handleResize() {
        let elemWidth = this.refs.flowTypeElement.getDOMNode().offsetWidth;
        let width = elemWidth > this.props.maximum ? this.props.maximum : elemWidth < this.props.minimum ? this.props.minimum : elemWidth;
        let fontBase = width / this.props.fontRatio;
        let fontSize = fontBase > this.props.maxFont ? this.props.maxFont : fontBase < this.props.minFont ? this.props.minFont : fontBase;

        this.setState({ fontSize });
    },

    // The child the user passes to this component needs to have it's
    // style.fontSize property to be updated
    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child) => {
            return ReactAddons.addons.cloneWithProps(child, {
                ref: 'flowTypeFontElement',
                
            });
        });
    },

    render() {
        return (
            <div
                ref="flowTypeElement"
                style={{
                    width: '100%',
                    height: '100%',
                    fontSize: this.state.fontSize
                }}>
                {this.props.children}
            </div>
        );
    }
});

export default FlowType;