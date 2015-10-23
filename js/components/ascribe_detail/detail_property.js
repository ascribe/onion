'use strict';

import React from 'react';


let DetailProperty = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        separator: React.PropTypes.string,
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
        let styles = {};
        const { labelClassName,
                label,
                separator,
                valueClassName,
                children,
                value } = this.props;

        if(this.props.ellipsis) {
            styles = {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            };
        }

        return (
            <div className="row ascribe-detail-property">
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
