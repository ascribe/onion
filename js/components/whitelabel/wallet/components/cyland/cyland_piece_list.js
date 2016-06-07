'use strict';

import React from 'react';
import PieceList from '../../../../piece_list';

import CylandAccordionListItem from './cyland_accordion_list/cyland_accordion_list_item';

import { currentUserShape, whitelabelShape } from '../../../../prop_types';

import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { getLangText } from '../../../../../utils/lang_utils';
import { withCurrentUser, withWhitelabel } from '../../../../../utils/react_utils';

let CylandPieceList = React.createClass({
    propTypes: {
        // Injected through HOCs
        currentUser: currentUserShape.isRequired,
        whitelabel: whitelabelShape.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    shouldRedirect(pieceCount) {
        const {
            currentUser: { email: userEmail },
            whitelabel: {
                user: whitelabelAdminEmail
            }
        } = this.props;

        return userEmail !== whitelabelAdminEmail && !pieceCount;
    },

    render() {
        setDocumentTitle(getLangText('Collection'));

        return (
            <PieceList
                {...this.props}
                accordionListItemType={CylandAccordionListItem}
                filterParams={[{
                    label: getLangText('Show works I have'),
                    items: [{
                        key: 'acl_loaned',
                        label: getLangText('loaned to Cyland')
                    }]
                }]}
                redirectTo={{
                    pathname: '/register_piece',
                    query: {
                        'slide_num': 0
                    }
                }}
                shouldRedirect={this.shouldRedirect} />
        );
    }
});

export default withCurrentUser(withWhitelabel(CylandPieceList));
