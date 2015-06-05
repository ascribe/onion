'use strict';

import React from 'react';
import AlertDismissable from '../components/ascribe_forms/alert';

let AlertMixin = {
    setAlerts(errors){
        let alerts = errors.map((error) => {
            return <AlertDismissable error={error} key={error}/>;
        });

        this.setState({alerts: alerts});
    },
    
    clearAlerts(){
        this.setState({alerts: null});
    }

};

export default AlertMixin;