'use strict';

import React from 'react';

import LumenusFurtherDetails from './lumenus_further_details';

import LumenusAclButtonList from '../lumenus_buttons/lumenus_acl_button_list';

import EditionContainer from '../../../../../ascribe_detail/edition_container';

let LumenusEditionContainer = React.createClass({
    propTypes: EditionContainer.propTypes,

    render() {
        return (
            <EditionContainer
                {...this.props}
                actionPanelButtonListType={LumenusAclButtonList}
                furtherDetailsType={LumenusFurtherDetails} />
        );
    }
});

export default LumenusEditionContainer;
