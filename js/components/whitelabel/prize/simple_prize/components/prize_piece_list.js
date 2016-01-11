'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import PrizeActions from '../actions/prize_actions';
import PrizeStore from '../stores/prize_store';

import AccordionListItemPrize from './ascribe_accordion_list/accordion_list_item_prize';
import PieceList from '../../../../piece_list';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';

let PrizePieceList = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        //Provided from router
        location: React.PropTypes.object
    },

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
        const { currentUser } = this.props;
        const { prize } = this.state;
        if (prize && prize.active && !currentUser.is_jury && !currentUser.is_admin && !currentUser.is_judge) {
            return (
                <LinkContainer to="/register_piece">
                    <Button>
                        {getLangText('Submit to prize')}
                    </Button>
                </LinkContainer>
            );
        } else {
            return null;
        }
    },

    render() {
        const { currentUser, location } = this.props;

        setDocumentTitle(getLangText('Collection'));

        let orderParams = ['artist_name', 'title'];
        if (currentUser.is_jury) {
            orderParams = ['rating', 'title'];
        }
        if (currentUser.is_judge) {
            orderParams = ['rating', 'title', 'selected'];
        }

        return (
            <PieceList
                ref="list"
                {...this.props}
                redirectTo="/register_piece"
                accordionListItemType={AccordionListItemPrize}
                orderParams={orderParams}
                orderBy={currentUser.is_jury ? 'rating' : null}
                filterParams={[]}
                customSubmitButton={this.getButtonSubmit()} />
        );
    }
});

export default PrizePieceList;
