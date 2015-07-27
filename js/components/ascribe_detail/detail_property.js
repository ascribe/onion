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
        breakWord: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            separator: ':',
            labelClassName: 'col-xs-3 col-sm-3 col-md-2 col-lg-2',
            valueClassName: 'col-xs-9 col-sm-9 col-md-10 col-lg-10'
        };
    },

    render() {
        let value = this.props.value;

        if (this.props.children){
            value = (
                <div className="row-same-height">
                    <div className="col-xs-6 col-xs-height col-bottom no-padding">
                        { this.props.value }
                    </div>
                    <div className="col-xs-6 col-xs-height">
                        { this.props.children }
                    </div>
                </div>);
        }
        return (
            <div className="row ascribe-detail-property">
                <div className="row-same-height">
                    <div className={this.props.labelClassName + ' col-xs-height col-bottom ascribe-detail-property-label'}>
                        { this.props.label + this.props.separator}
                    </div>
                    <div className={this.props.valueClassName + ' col-xs-height col-bottom ascribe-detail-property-value'}>
                        {value}
                    </div>
                </div>
            </div>
        );
    }
});



export default DetailProperty;
