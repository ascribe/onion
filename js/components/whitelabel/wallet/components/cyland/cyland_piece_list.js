'use strict';

import React from 'react';
import PieceList from '../../../../piece_list';

import CylandAccordionListItem from './cyland_accordion_list/cyland_accordion_list_item';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let CylandPieceList = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    render() {
        setDocumentTitle(getLangText('Collection'));

        return (
            <div>
                <PieceList
                    {...this.props}
                    redirectTo="/register_piece?slide_num=0"
                    accordionListItemType={CylandAccordionListItem}
                    filterParams={[{
                        label: getLangText('Show works I have'),
                        items: [{
                            key: 'acl_loaned',
                            label: getLangText('loaned to Cyland')
                        }]
                    }]} />
            </div>
        );
    }
});

export default CylandPieceList;
