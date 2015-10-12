'use strict';

import React from 'react';
import Router from 'react-router';
import StarRating from 'react-star-rating';

import PieceListActions from '../../../../../actions/piece_list_actions';
import PieceListStore from '../../../../../stores/piece_list_store';

import PrizeRatingActions from '../../actions/prize_rating_actions';

import UserStore from '../../../../../stores/user_store';

import InputCheckbox from '../../../../ascribe_forms/input_checkbox';

import AccordionListItemPiece from '../../../../ascribe_accordion_list/accordion_list_item_piece';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import AclProxy from '../../../../acl_proxy';
import SubmitToPrizeButton from './../ascribe_buttons/submit_to_prize_button';


import { getLangText } from '../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../utils/general_utils';

let Link = Router.Link;


let AccordionListItemPrize = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSubmitPrizeSuccess(response) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);

        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getPrizeButtons() {
        if (this.state.currentUser && this.state.currentUser.is_jury){
            if ((this.props.content.ratings) &&
                (this.props.content.ratings.rating || this.props.content.ratings.average)){
                // jury and rating available
                let rating = null,
                    caption = null;
                if (this.props.content.ratings.rating){
                    rating = parseInt(this.props.content.ratings.rating, 10);
                    caption = getLangText('Your rating');
                }
                else if (this.props.content.ratings.average){
                    rating = this.props.content.ratings.average;
                    caption = getLangText('Average of ' + this.props.content.ratings.num_ratings + ' rating(s)');
                }

                return (
                    <div id="list-rating" className="pull-right">
                        <Link to='piece' params={{pieceId: this.props.content.id}}>
                            <StarRating
                                ref='rating'
                                name="prize-rating"
                                caption={caption}
                                step={0.5}
                                size='sm'
                                rating={rating}
                                ratingAmount={5} />
                        </Link>
                    </div>);
            }
            else {
                if (this.state.currentUser.is_judge){
                    return (
                        <div className="react-rating-caption pull-right">
                            {getLangText('Not rated')}
                        </div>
                    );
                }
                // jury and no rating yet
                return (
                    <div className="react-rating-caption pull-right">
                        <Link to='piece' params={{pieceId: this.props.content.id}}>
                            {getLangText('Submit your rating')}
                        </Link>
                    </div>
                );
            }
        }
        return this.getPrizeButtonsParticipant();

    },

    getPrizeButtonsParticipant() {
        return (
            <div>
                <AclProxy
                    aclObject={this.props.content.acl}
                    aclName="acl_wallet_submit">
                    <SubmitToPrizeButton
                        className="pull-right"
                        piece={this.props.content}
                        handleSuccess={this.handleSubmitPrizeSuccess}/>
                </AclProxy>
            </div>
        );
    },

    handleShortlistSuccess(message){
        let notification = new GlobalNotificationModel(message, 'success', 2000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    refreshPieceData() {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);
    },

    onSelectChange(){
        PrizeRatingActions.toggleShortlist(this.props.content.id)
        .then(
            (res) => {
                this.refreshPieceData();
                return res;
            })
        .then(
            (res) => {
                this.handleShortlistSuccess(res.notification);
            }
        );

    },

    getPrizeBadge(){
        if (this.state.currentUser && this.state.currentUser.is_judge) {
            return (
                <span className="pull-right ascribe-checkbox-wrapper ascribe-checkbox-badge">
                    <InputCheckbox
                        defaultChecked={this.props.content.selected}
                        onChange={this.onSelectChange}/>
                </span>
            );
        }
        return null;
    },

    render() {
        // Only show the artist name if you are the participant or if you are a judge and the piece is shortlisted
        let artistName = ((this.state.currentUser.is_jury && !this.state.currentUser.is_judge) ||
                (this.state.currentUser.is_judge && !this.props.content.selected )) ?
                <span className="glyphicon glyphicon-eye-close" aria-hidden="true"/> : this.props.content.artist_name;
        return (
            <div>
                <AccordionListItemPiece
                    className={this.props.className}
                    piece={this.props.content}
                    artistName={artistName}
                    subsubheading={
                        <div className="pull-left">
                            <span>{this.props.content.date_created.split('-')[0]}</span>
                        </div>}
                    buttons={this.getPrizeButtons()}
                    badge={this.getPrizeBadge()}>
                    {this.props.children}
                </AccordionListItemPiece>
            </div>
        );
    }
});

export default AccordionListItemPrize;
