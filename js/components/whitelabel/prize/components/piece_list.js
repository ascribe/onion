'use strict';

import React from 'react';
import PieceList from '../../../piece_list';

import PrizeActions from '../actions/prize_actions';
import PrizeStore from '../stores/prize_store';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import AccordionListItemPrize from './ascribe_accordion_list/accordion_list_item_prize';

let PrizePieceList = React.createClass({
    getInitialState() {
        return PrizeStore.getState();
    },

    componentDidMount() {
        PrizeStore.listen(this.onChange);
        PrizeActions.fetchPrize();
    },

    componentWillUnmount() {
        PrizeStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },
    getButtonSubmit() {
        if (this.state.prize && this.state.prize.active){
            return (
                <ButtonLink to="register_piece">
                    Submit to prize
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
                    orderParams={['rating', 'title']}
                    customSubmitButton={this.getButtonSubmit()}/>
            </div>
        );
    }
});

export default PrizePieceList;
