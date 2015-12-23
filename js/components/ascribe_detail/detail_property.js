'use strict';

import React from 'react';
import classNames from 'classnames';


const DetailProperty = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        separator: React.PropTypes.string,
        className: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        valueClassName: React.PropTypes.string,
        ellipsis: React.PropTypes.bool,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    getDefaultProps() {
        return {
            separator: '',
            labelClassName: 'col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xs-height ascribe-detail-property-label',
            valueClassName: 'col-xs-9 col-sm-9 col-md-10 col-lg-10 col-xs-height col-bottom ascribe-detail-property-value'
        };
    },

    render() {
        const {
            children,
            className,
            label,
            labelClassName,
            separator,
            valueClassName,
            value } = this.props;

        const styles = this.props.ellipsis ? {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        } : null;

        return (
            <div className={classNames('row ascribe-detail-property', className)}>
                <div className="row-same-height">
                    <div className={labelClassName}>
                        {label} {separator}
                    </div>
                    <div
                        className={valueClassName}
                        style={styles}>
                        {children || value}
                    </div>
                </div>
            </div>
        );
    }
});



export default DetailProperty;
