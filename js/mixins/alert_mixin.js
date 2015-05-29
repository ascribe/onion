import React from 'react';
import AlertDismissable from '../components/ascribe_forms/alert';

let AlertMixin = {
    setAlerts(errors){
        let alerts = errors.map(
                        function(error) {
                            let key = error + this.state.retry;
                            return <AlertDismissable error={error} key={key}/>;
                        }.bind(this)
                    );
        this.setState({alerts: alerts, retry: this.state.retry + 1});
    },
    clearAlerts(){
        this.setState({alerts: null});
    }

};

export default AlertMixin;