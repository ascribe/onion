'use strict';

import React from 'react';
import PieceList from '../../../../piece_list';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';

import PrizeActions from '../actions/prize_actions';
import PrizeStore from '../stores/prize_store';

import Button from 'react-bootstrap/lib/Button';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import AccordionListItemPrize from './ascribe_accordion_list/accordion_list_item_prize';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';

let PrizePieceList = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            PrizeStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        PrizeStore.listen(this.onChange);
        PrizeActions.fetchPrize();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        PrizeStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getButtonSubmit() {
        const { currentUser, prize } = this.state;
        if (prize && prize.active && !currentUser.is_jury && !currentUser.is_admin && !currentUser.is_judge) {
            return (
                <LinkContainer to="/register_piece">
                    <Button>
                        {getLangText('Submit to prize')}
                    </Button>
                </LinkContainer>
            );
        }
        return null;
    },

    render() {
        setDocumentTitle(getLangText('Collection'));

        let orderParams = ['artist_name', 'title'];
        if (this.state.currentUser.is_jury) {
            orderParams = ['rating', 'title'];
        }
        if (this.state.currentUser.is_judge) {
            orderParams = ['rating', 'title', 'selected'];
        }
        return (
            <div>
                <PieceList
                    ref="list"
                    redirectTo="/register_piece"
                    accordionListItemType={AccordionListItemPrize}
                    orderParams={orderParams}
                    orderBy={this.state.currentUser.is_jury ? 'rating' : null}
                    filterParams={[]}
                    customSubmitButton={this.getButtonSubmit()}
                    location={this.props.location}/>
            </div>
        );
    }
});

export default PrizePieceList;
