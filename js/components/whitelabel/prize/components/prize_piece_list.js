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
        if (this.state.prize && this.state.prize.active && !this.state.currentUser.is_jury){
            return (
                <ButtonLink to="register_piece">
                    {getLangText('Submit to prize')}
                </ButtonLink>
            );
        }
        else if (this.state.prize && this.state.currentUser.is_judge){
            return null;
        }
        return null;
    },

    render() {
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
                    redirectTo="register_piece"
                    accordionListItemType={AccordionListItemPrize}
                    orderParams={orderParams}
                    orderBy={this.state.currentUser.is_jury ? 'rating' : null}
                    filterParams={[]}
                    customSubmitButton={this.getButtonSubmit()}/>
            </div>
        );
    }
});

export default PrizePieceList;
