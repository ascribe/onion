'use strict';

import React from 'react';
import PieceList from '../../../piece_list';

import UserActions from '../../../../actions/user_actions';
import UserStore from '../../../../stores/user_store';

import PrizeActions from '../actions/prize_actions';
import PrizeStore from '../stores/prize_store';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import AccordionListItemPrize from './ascribe_accordion_list/accordion_list_item_prize';

import { mergeOptions } from '../../../../utils/general_utils';
import { getLangText } from '../../../../utils/lang_utils';

let PrizePieceList = React.createClass({
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
        if (this.state.prize && this.state.prize.active){
            return (
                <ButtonLink to="register_piece">
                    {getLangText('Submit to prize')}
                </ButtonLink>
            );
        }
        return null;
    },

    render() {
        return (
            <div>
                <PieceList
                    redirectTo="register_piece"
                    accordionListItemType={AccordionListItemPrize}
                    orderParams={this.state.currentUser.is_jury ? ['rating', 'title'] : ['artist_name', 'title']}
                    filterParams={null}
                    customSubmitButton={this.getButtonSubmit()}/>
            </div>
        );
    }
});

export default PrizePieceList;
