'use strict';

import React from 'react';

import LumenusFurtherDetails from './lumenus_further_details';

import LumenusAclButtonList from '../lumenus_buttons/lumenus_acl_button_list';

import EditionContainer from '../../../../../ascribe_detail/edition_container';

let LumenusEditionContainer = React.createClass({
    propTypes: {
        params: React.PropTypes.object,
        location: React.PropTypes.object
    },

    render() {
        return (
            <EditionContainer
                params={this.props.params}
                actionPanelButtonListType={LumenusAclButtonList}
                furtherDetailsType={LumenusFurtherDetails}
                location={this.props.location} />
        );
    }
});

export default LumenusEditionContainer;
