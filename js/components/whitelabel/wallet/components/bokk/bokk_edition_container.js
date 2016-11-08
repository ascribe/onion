'use strict';

import React from 'react';

import BokkAclButtonList from './bokk_acl_button_list';

import EditionContainer from '../../../../ascribe_detail/edition_container';


let BokkEditionContainer = React.createClass({
    propTypes: EditionContainer.propTypes,

    render() {
        return (
            <EditionContainer
                {...this.props}
                actionPanelButtonListType={BokkAclButtonList} />
        );
    }
});

export default BokkEditionContainer;
