'use strict';

import React from 'react';
import classNames from 'classnames';

let AscribeSpinner = React.createClass({
    propTypes: {
        size: React.PropTypes.oneOf(['sm', 'md', 'lg']),
        color: React.PropTypes.oneOf(['blue', 'dark-blue', 'light-blue', 'pink', 'black', 'loop'])
    },

    getDefaultProps() {
        return {
            size: 'sm',
            color: 'loop'
        };
    },

    render() {
        return (
            <div className={classNames('spinner-wrapper-' + this.props.size, 'spinner-wrapper-' + this.props.color)}>
                <div className={classNames('spinner-circle')}></div>
                <div className={classNames('spinner-inner')}>A</div>
            </div>
        );
    }
});

export default AscribeSpinner;
