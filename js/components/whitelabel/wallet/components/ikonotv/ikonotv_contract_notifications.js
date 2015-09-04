'use strict';

import React from 'react';

import NotificationStore from '../../../../../stores/notification_store';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import { mergeOptions } from '../../../../../utils/general_utils';

let IkonotvContractNotifications = React.createClass({

    getInitialState() {
        return mergeOptions(
            NotificationStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        console.log(this.state)
        return (
            <div className='container'>
                <div className='text-center'>
                    <img src={this.state.whitelabel.logo} />
                </div>
            </div>
        );
    }
});

export default IkonotvContractNotifications;