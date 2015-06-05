'use strict';

import React from 'react';

import AlertMixin from '../../mixins/alert_mixin';

let InputHidden = React.createClass({

    mixins: [AlertMixin],

    getInitialState() {
        return {value: this.props.value,
                alerts: null // needed in AlertMixin
        };
    },
    handleChange(event) {
        this.setState({value: event.target.value});
    },
    render() {
        let alerts = (this.props.submitted) ? null : this.state.alerts;
        return (
            <div className="form-group">
                {alerts}
                <input
                    value={this.props.value}
                    type="hidden"
                    onChange={this.handleChange}
                />
            </div>
        );

    }
});

export default InputHidden;