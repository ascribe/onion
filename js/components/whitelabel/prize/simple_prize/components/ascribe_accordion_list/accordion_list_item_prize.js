'use strict';

import React from 'react';
import { Link } from 'react-router';
import StarRating from 'react-star-rating';
import Moment from 'moment';

import PieceListActions from '../../../../../../actions/piece_list_actions';
import PieceListStore from '../../../../../../stores/piece_list_store';

import PrizeRatingActions from '../../actions/prize_rating_actions';

import InputCheckbox from '../../../../../ascribe_forms/input_checkbox';

import AccordionListItemPiece from '../../../../../ascribe_accordion_list/accordion_list_item_piece';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import AclProxy from '../../../../../acl_proxy';
import SubmitToPrizeButton from './../ascribe_buttons/submit_to_prize_button';

import { getLangText } from '../../../../../../utils/lang_utils';


let AccordionListItemPrize = React.createClass({
    propTypes: {
        content: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        className: React.PropTypes.string
    },

    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSubmitPrizeSuccess(response) {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });

        const notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getPrizeButtons() {
        const { currentUser, content: { id, ratings } } = this.props;

        if (currentUser && (currentUser.is_jury || currentUser.is_judge)) {
            if (ratings && (ratings.rating || ratings.average)) {
                // jury and rating available
                let rating = null;
                let caption = null;

                if (ratings.rating) {
                    rating = parseInt(ratings.rating, 10);
                    caption = getLangText('Your rating');
                } else if (ratings.average) {
                    rating = ratings.average;
                    caption = getLangText('Average of ' + ratings.num_ratings + ' rating(s)');
                }

                return (
                    <div id="list-rating" className="pull-right">
                        <Link to={`/pieces/${id}`}>
                            <StarRating
                                ref='rating'
                                name="prize-rating"
                                caption={caption}
                                step={0.5}
                                size='sm'
                                rating={rating}
                                ratingAmount={5} />
                        </Link>
                    </div>
                );
            } else {
                if (currentUser.is_judge) {
                    return (
                        <div className="react-rating-caption pull-right">
                            {getLangText('Not rated')}
                        </div>
                    );
                } else {
                    // jury and no rating yet
                    return (
                        <div className="react-rating-caption pull-right">
                            <Link to={`/pieces/${id}`}>
                                {getLangText('Submit your rating')}
                            </Link>
                        </div>
                    );
                }
            }
        } else {
            return this.getPrizeButtonsParticipant();
        }
    },

    getPrizeButtonsParticipant() {
        return (
            <AclProxy
                aclObject={this.props.content.acl}
                aclName="acl_wallet_submit">
                <SubmitToPrizeButton
                    className="pull-right"
                    piece={this.props.content}
                    handleSuccess={this.handleSubmitPrizeSuccess} />
            </AclProxy>
        );
    },

    handleShortlistSuccess(message) {
        const notification = new GlobalNotificationModel(message, 'success', 2000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    refreshPieceData() {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
    },

    onSelectChange() {
        PrizeRatingActions.toggleShortlist(this.props.content.id)
        .then((res) => {
            this.refreshPieceData();
            this.handleShortlistSuccess(res.notification);
        });

    },

    getPrizeBadge() {
        const { currentUser } = this.props;

        if (currentUser && currentUser.is_judge) {
            return (
                <span className="pull-right ascribe-checkbox-wrapper ascribe-checkbox-badge">
                    <InputCheckbox
                        defaultChecked={this.props.content.selected}
                        onChange={this.onSelectChange} />
                </span>
            );
        } else {
            return null;
        }
    },

    render() {
        const { children, className, content, currentUser } = this.props;

        // Only show the artist name if you are the participant or if you are a judge and the piece is shortlisted
        const artistName = ((currentUser.is_jury && !currentUser.is_judge) || (currentUser.is_judge && !content.selected )) ?
                <span className="glyphicon glyphicon-eye-close" aria-hidden="true"/> : content.artist_name;

        return (
            <AccordionListItemPiece
                className={className}
                piece={content}
                artistName={artistName}
                subsubheading={
                    <div>
                        <span>{Moment(content.date_created, 'YYYY-MM-DD').year()}</span>
                    </div>
                }
                buttons={this.getPrizeButtons()}
                badge={this.getPrizeBadge()}>
                {children}
            </AccordionListItemPiece>
        );
    }
});

export default AccordionListItemPrize;
