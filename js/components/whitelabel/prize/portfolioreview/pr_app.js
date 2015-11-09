'use strict';

import React from 'react';
import GlobalNotification from '../../../global_notification';

import { getSubdomain } from '../../../../utils/general_utils';


let PrizeApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        history: React.PropTypes.object,
        routes: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    render() {
        const { children } = this.props;
        let subdomain = getSubdomain();

        return (
            <div className={'container ascribe-prize-app client--' + subdomain}>
                {children}
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default PrizeApp;
