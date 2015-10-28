'use strict';

import React from 'react';

import LumenusAclButtonList from './lumenus_buttons/lumenus_acl_button_list';

import PieceList from '../../../../piece_list';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';

let LumenusPieceList = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    render() {
        setDocumentTitle(getLangText('Collection'));

        return (
            <div>
                <PieceList
                    redirectTo="/register_piece?slide_num=0"
                    bulkModalButtonListType={LumenusAclButtonList}
                    filterParams={[{
                        label: getLangText('Show works I have'),
                        items: [{
                            key: 'acl_consigned',
                            label: getLangText('consigned to Lumenus')
                        }]
                    }]}
                    location={this.props.location}/>
            </div>
        );
    }
});

export default LumenusPieceList;
