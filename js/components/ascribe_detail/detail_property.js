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
        ellipsis: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            separator: ':',
            labelClassName: 'col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xs-height col-bottom ascribe-detail-property-label',
            valueClassName: 'col-xs-9 col-sm-9 col-md-10 col-lg-10 col-xs-height col-bottom ascribe-detail-property-value'
        };
    },

    render() {
        let value = this.props.value;
        let styles = {};

        if(this.props.ellipsis) {
            styles = {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            };
        }


        if (this.props.children){
            value = (
                <div className="row-same-height">
                    <div className="col-xs-6 col-xs-height col-bottom no-padding">
                        { this.props.value }
                    </div>
                    <div
                        className="col-xs-6 col-xs-height"
                        style={styles}>
                        { this.props.children }
                    </div>
                </div>);
        }
        return (
            <div className="row ascribe-detail-property">
                <div className="row-same-height">
                    <div className={this.props.labelClassName}>
                        { this.props.label } { this.props.separator}
                    </div>
                    <div
                        className={this.props.valueClassName}
                        style={styles}>
                        {value}
                    </div>
                </div>
            </div>
        );
    }
});



export default DetailProperty;
