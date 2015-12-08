'use strict';

import React from 'react';

import MarketFurtherDetails from './market_further_details';

import MarketAclButtonList from '../market_buttons/market_acl_button_list';

import EditionContainer from '../../../../../ascribe_detail/edition_container';

let MarketEditionContainer = React.createClass({
    propTypes: EditionContainer.propTypes,

    render() {
        return (
            <EditionContainer
                {...this.props}
                actionPanelButtonListType={MarketAclButtonList}
                furtherDetailsType={MarketFurtherDetails} />
        );
    }
});

export default MarketEditionContainer;
