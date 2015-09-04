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
                    <div>
                        <img src={this.state.whitelabel.logo} />
                    </div>
                    <div>
                        <embed src={this.state.contractAgreementListNotifications[0].contract_agreement.contract.blob}
                               width="600" height="500" alt="pdf"
                               pluginspage="http://www.adobe.com/products/acrobat/readstep2.html" />
                    </div>
                </div>
            </div>
        );
    }
});

export default IkonotvContractNotifications;