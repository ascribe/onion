'use strict';

import React from 'react';

import StarRating from 'react-star-rating';

import PieceActions from '../../../../../actions/piece_actions';
import PieceStore from '../../../../../stores/piece_store';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import PrizeRatingActions from '../../actions/prize_rating_actions';
import PrizeRatingStore from '../../stores/prize_rating_store';

import UserStore from '../../../../../stores/user_store';

import Piece from '../../../../../components/ascribe_detail/piece';

import AppConstants from '../../../../../constants/application_constants';

import Form from '../../../../../components/ascribe_forms/form';
import Property from '../../../../../components/ascribe_forms/property';
import InputTextAreaToggable from '../../../../../components/ascribe_forms/input_textarea_toggable';
import CollapsibleParagraph from '../../../../../components/ascribe_collapsible/collapsible_paragraph';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import DetailProperty from '../../../../ascribe_detail/detail_property';

import ApiUrls from '../../../../../constants/api_urls';
import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';
/**
 * This is the component that implements resource/data specific functionality
 */
let PieceContainer = React.createClass({
    getInitialState() {
        return PieceStore.getState();
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});
        PieceStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    render() {
        if('title' in this.state.piece) {
            return (
                <Piece
                    piece={this.state.piece}
                    loadPiece={this.loadPiece}
                    header={
                        <div className="ascribe-detail-header">
                            <NavigationHeader/>
                            <h1 className="ascribe-detail-title">{this.state.piece.title}</h1>
                            <hr/>
                            <DetailProperty label="BY" value={this.state.piece.artist_name} />
                            <DetailProperty label="DATE" value={ this.state.piece.date_created.slice(0, 4) } />
                            <hr/>
                        </div>
                        }
                    subheader={
                        <PrizePieceRatings piece={this.state.piece}/>
                    }>
                    <PrizePieceDetails piece={this.state.piece}/>
                </Piece>
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </div>
            );
        }
    }
});

let NavigationHeader = React.createClass({
    propTypes: {
        piece: React.PropTypes.object
    },

    render() {
        return (
            <div>
                navigation
            </div>
        );
    }
});


let PrizePieceRatings = React.createClass({
    propTypes: {
        piece: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            PrizeRatingStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        PrizeRatingStore.listen(this.onChange);
        PrizeRatingActions.fetchOne(this.props.piece.id);
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PrizeRatingActions.updateRating({});
        PrizeRatingStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
        if (this.refs.rating) {
            this.refs.rating.state.ratingCache = {
                pos: this.refs.rating.state.pos,
                rating: this.state.currentRating,
                caption: this.refs.rating.props.caption,
                name: this.refs.rating.props.name
            };
        }
    },

    onRatingClick(event, args) {
        event.preventDefault();
        PrizeRatingActions.createRating(this.props.piece.id, args.rating).then(
            PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                            this.state.orderBy, this.state.orderAsc, this.state.filterBy)
        );
    },
    render(){
        if (this.state.currentUser && this.state.currentUser.is_jury) {
            return (
                <div>
                    <DetailProperty
                        labelClassName='col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xs-height col-middle ascribe-detail-property-label'
                        label={
                        <span>YOUR VOTE</span>
                    }
                        value={
                        <StarRating
                            ref='rating'
                            name="prize-rating"
                            caption=""
                            step={1}
                            size='md'
                            rating={this.state.currentRating}
                            onRatingClick={this.onRatingClick}
                            ratingAmount={5} />
                    }/>
                    <PersonalNote
                        piece={this.props.piece}
                        currentUser={this.state.currentUser}/>
                </div>);
        }
        return null;
    }
});

let PersonalNote = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        currentUser: React.PropTypes.object
    },
    showNotification(){
        let notification = new GlobalNotificationModel(getLangText('Jury note saved'), 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        if (this.props.currentUser.username && true || false) {
            return (
                <Form
                    url={ApiUrls.notes}
                    handleSuccess={this.showNotification}>
                    <Property
                        name='value'
                        label={getLangText('Note')}
                        editable={true}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={true}
                            defaultValue={this.props.piece.note_from_user ? this.props.piece.note_from_user.note : null}
                            placeholder={getLangText('Enter a personal note%s', '...')}/>
                    </Property>
                    <Property hidden={true} name='piece_id'>
                        <input defaultValue={this.props.piece.id}/>
                    </Property>
                    <hr />
                </Form>
            );
        }
        return null;
    }
});


let PrizePieceDetails = React.createClass({
    propTypes: {
        piece: React.PropTypes.object
    },

    render() {
        if (this.props.piece.prize
            && this.props.piece.prize.name
            && Object.keys(this.props.piece.extra_data).length !== 0){
            return (
                <CollapsibleParagraph
                    title="Prize Details"
                    show={true}
                    defaultExpanded={true}>
                    <Form ref='form'>
                        {Object.keys(this.props.piece.extra_data).map((data) => {
                            let label = data.replace('_', ' ');
                            return (
                                <Property
                                    name={data}
                                    label={label}
                                    editable={false}>
                                    <InputTextAreaToggable
                                        rows={1}
                                        editable={false}
                                        defaultValue={this.props.piece.extra_data[data]}/>
                                </Property>);
                            }
                        )}
                        <hr />
                    </Form>
                </CollapsibleParagraph>
            );
        }
        return null;
    }
});

export default PieceContainer;
