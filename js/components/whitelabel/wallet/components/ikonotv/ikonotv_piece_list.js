'use strict';

import React from 'react';
import PieceList from '../../../../piece_list';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';

import IkonotvAccordionListItem from './ascribe_accordion_list/ikonotv_accordion_list_item';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let IkonotvPieceList = React.createClass({
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

    render() {
        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <div>
                <PieceList
                    redirectTo="/register_piece?slide_num=0"
                    accordionListItemType={IkonotvAccordionListItem}
                    filterParams={[{
                        label: getLangText('Show works I have'),
                        items: [
                            {
                                key: 'submitted',
                                label: getLangText('submitted')
                            },
                            {
                                key: 'accepted',
                                label: getLangText('loaned')
                            }
                        ]
                    }]}
                    location={this.props.location}/>
            </div>
        );
    }
});

export default IkonotvPieceList;
