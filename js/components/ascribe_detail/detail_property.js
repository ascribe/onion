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
        valueClassName: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            separator: ':',
            labelClassName: 'col-xs-5 col-sm-4 col-md-3 col-lg-3',
            valueClassName: 'col-xs-7 col-sm-8 col-md-9 col-lg-9'
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
                    <div className={this.props.labelClassName + ' col-xs-height col-bottom'}>
                        <div>{ this.props.label + this.props.separator}</div>
                    </div>
                    <div className={this.props.valueClassName + ' col-xs-height col-bottom'}>
                        {value}
                    </div>
                </div>
            </div>
        );
    }
});



export default DetailProperty;
