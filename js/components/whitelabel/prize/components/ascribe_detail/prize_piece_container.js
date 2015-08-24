'use strict';

import React from 'react';
import Router from 'react-router';

import StarRating from 'react-star-rating';

import PieceActions from '../../../../../actions/piece_actions';
import PieceStore from '../../../../../stores/piece_store';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import PrizeRatingActions from '../../actions/prize_rating_actions';
import PrizeRatingStore from '../../stores/prize_rating_store';

import UserStore from '../../../../../stores/user_store';

import Piece from '../../../../../components/ascribe_detail/piece';
import Note from '../../../../../components/ascribe_detail/note';

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

let Link = Router.Link;

/**
 * This is the component that implements resource/data specific functionality
 */
let PieceContainer = React.createClass({
    getInitialState() {
        return mergeOptions(
            PieceStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
        PieceActions.fetchOne(this.props.params.pieceId);
        UserStore.listen(this.onChange);
    },

    // This is done to update the container when the user clicks on the prev or next
    // button to update the URL parameter (and therefore to switch pieces)
    componentWillReceiveProps(nextProps) {
        if(this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.updatePiece({});
            PieceActions.fetchOne(nextProps.params.pieceId);
        }
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});
        PieceStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },


    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    render() {
        if('title' in this.state.piece) {
            let artistName = this.state.currentUser.is_jury ?
                <span className="glyphicon glyphicon-eye-close" aria-hidden="true"/> : this.state.piece.artist_name;
            return (
                <Piece
                    piece={this.state.piece}
                    loadPiece={this.loadPiece}
                    header={
                        <div className="ascribe-detail-header">
                            <NavigationHeader
                                piece={this.state.piece}
                                currentUser={this.state.currentUser}/>
                            <hr/>
                            <h1 className="ascribe-detail-title">{this.state.piece.title}</h1>
                            <DetailProperty label="BY" value={artistName} />
                            <DetailProperty label="DATE" value={ this.state.piece.date_created.slice(0, 4) } />
                            <hr/>
                        </div>
                        }
                    subheader={
                        <PrizePieceRatings
                            piece={this.state.piece}
                            currentUser={this.state.currentUser}/>
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
        piece: React.PropTypes.object,
        currentUser: React.PropTypes.object
    },

    render() {
        if (this.props.currentUser && this.props.currentUser.email && this.props.piece && this.props.piece.navigation) {
            let nav = this.props.piece.navigation;

            return (
                <div style={{marginBottom: '1em'}}>
                    <div className="row no-margin">
                        <Link className="disable-select" to='piece' params={{pieceId: nav.prev_index ? nav.prev_index : this.props.piece.id}}>
                            <span className="glyphicon glyphicon-chevron-left pull-left link-ascribe" aria-hidden="true">
                            {getLangText('Previous')}
                            </span>
                        </Link>
                        <Link className="disable-select" to='piece' params={{pieceId: nav.next_index ? nav.next_index : this.props.piece.id}}>
                            <span className="pull-right link-ascribe">
                                {getLangText('Next')}
                                <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                            </span>
                        </Link>
                    </div>
                </div>
            );
        }
        return null;
    }
});


let PrizePieceRatings = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        currentUser: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            PrizeRatingStore.getState()
        );
    },

    componentDidMount() {
        PrizeRatingStore.listen(this.onChange);
        PrizeRatingActions.fetchOne(this.props.piece.id);
        PrizeRatingActions.fetchAverage(this.props.piece.id);
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PrizeRatingActions.updateRating({});
        PrizeRatingStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
    },

    // The StarRating component does not have a property that lets us set
    // a default value at initialization. Since the ratingCache would otherwise on
    // every mouseover be overridden, we need to set it ourselves initially to deal
    // with the problem.
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

    getId() {
        return {'piece_id': this.props.piece.id};
    },

    render(){
        if (this.props.currentUser && this.props.currentUser.is_judge && this.state.average) {
            return (
                <CollapsibleParagraph
                    title="Average Rating"
                    show={true}
                    defaultExpanded={true}>
                        <div style={{marginLeft: '1.5em', marginBottom: '1em'}}>
                        <StarRating
                            ref='average-rating'
                            name="average-rating"
                            caption=""
                            size='md'
                            step={0.5}
                            rating={this.state.average}
                            ratingAmount={5}/>
                        </div>
                    <hr />
                    {this.state.ratings.map((item) => {
                        return item.user;
                    })}
                    <hr />
                </CollapsibleParagraph>);
        }
        else if (this.props.currentUser && this.props.currentUser.is_jury) {
            return (
                <CollapsibleParagraph
                    title="Rating"
                    show={true}
                    defaultExpanded={true}>
                        <div style={{marginLeft: '1.5em', marginBottom: '1em'}}>
                        <StarRating
                            ref='rating'
                            name="prize-rating"
                            caption=""
                            step={1}
                            size='md'
                            rating={this.state.currentRating}
                            onRatingClick={this.onRatingClick}
                            ratingAmount={5} />
                        </div>
                    <Note
                        id={this.getId}
                        label={getLangText('Jury note')}
                        defaultValue={this.props.piece && this.props.piece.note_from_user ? this.props.piece.note_from_user.note : null}
                        placeholder={getLangText('Enter your comments ...')}
                        editable={true}
                        successMessage={getLangText('Jury note saved')}
                        url={ApiUrls.notes}
                        currentUser={this.props.currentUser}/>
                </CollapsibleParagraph>);
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
        if (this.props.currentUser && this.props.currentUser.username) {
            return (
                <Form
                    url={ApiUrls.notes}
                    handleSuccess={this.showNotification}>
                    <Property
                        name='value'
                        label={getLangText('Jury note')}
                        editable={true}>
                        <InputTextAreaToggable
                            rows={1}
                            editable={true}
                            defaultValue={this.props.piece && this.props.piece.note_from_user ? this.props.piece.note_from_user.note : null}
                            placeholder={getLangText('Enter your comments...')}/>
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
        if (this.props.piece
            && this.props.piece.prize
            && this.props.piece.prize.name
            && Object.keys(this.props.piece.extra_data).length !== 0){
            return (
                <CollapsibleParagraph
                    title={getLangText('Prize Details')}
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
