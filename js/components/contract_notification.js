'use strict';

import React from 'react';

import NotificationStore from '../stores/notification_store';

import { mergeOptions } from '../utils/general_utils';

let ContractNotification = React.createClass({
    getInitialState() {
        return mergeOptions(
            NotificationStore.getState()
        );
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {

        return (
            null
        );
    }
});

export default ContractNotification;