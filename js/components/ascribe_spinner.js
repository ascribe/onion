'use strict';

import React from 'react';
import classNames from 'classnames';

let AscribeSpinner = React.createClass({
    propTypes: {
        classNames: React.PropTypes.string,
        size: React.PropTypes.oneOf(['sm', 'md', 'lg']),
        color: React.PropTypes.oneOf(['blue', 'dark-blue', 'light-blue', 'pink', 'black', 'loop'])
    },

    getDefaultProps() {
        return {
            inline: false,
            size: 'md',
            color: 'loop'
        };
    },

    render() {
        return (
            <div
                className={
                    classNames('spinner-wrapper-' + this.props.size,
                    'spinner-wrapper-' + this.props.color,
                    this.props.classNames)}>
                    <div className={classNames('spinner-circle')}></div>
                    <div className={classNames('spinner-inner')}>A</div>
            </div>
        );
    }
});

export default AscribeSpinner;
