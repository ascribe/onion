import React from 'react';

import AlertMixin from '../../mixins/alert_mixin'

let InputText = React.createClass({

    mixins : [AlertMixin],

    getInitialState() {
        return {value: null,
                alerts: null // needed in AlertMixin
        };
    },
    handleChange(event) {
        this.setState({value: event.target.value});
    },
    render() {
        let className = "form-control input-text-ascribe";
        let alerts = (this.props.submitted) ? null : this.state.alerts;
        return (
            <div className="form-group">
                {alerts}
                <input className={className}
                        placeholder={this.props.placeHolder}
                        required={this.props.required}
                        type={this.props.type}
                        onChange={this.handleChange}/>
            </div>
        );

    }
});

export default InputText;