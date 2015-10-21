'use strict';

import React from 'react';
import PieceList from '../../../../piece_list';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let LumenusPieceList = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    showOnlyConsignAcl(aclName) {
        return aclName === 'acl_consign' ||
               aclName === 'acl_unconsign';
    },

    render() {
        setDocumentTitle(getLangText('Collection'));

        return (
            <div>
                <PieceList
                    redirectTo="/register_piece?slide_num=0"
                    aclFilterBy={this.showOnlyConsignAcl}
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
