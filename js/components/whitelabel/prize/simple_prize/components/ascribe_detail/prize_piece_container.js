'use strict';

import React from 'react';
import { Link } from 'react-router';
import Moment from 'moment';

import StarRating from 'react-star-rating';

import ReactError from '../../../../../../mixins/react_error';
import { ResourceNotFoundError } from '../../../../../../models/errors';

import PrizeActions from '../../actions/prize_actions';
import PrizeStore from '../../stores/prize_store';
import PrizeRatingActions from '../../actions/prize_rating_actions';
import PrizeRatingStore from '../../stores/prize_rating_store';

import PieceListStore from '../../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../../actions/piece_list_actions';
import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import Piece from '../../../../../../components/ascribe_detail/piece';
import Note from '../../../../../../components/ascribe_detail/note';

import AscribeSpinner from '../../../../../ascribe_spinner';

import Form from '../../../../../../components/ascribe_forms/form';
import Property from '../../../../../../components/ascribe_forms/property';
import InputTextAreaToggable from '../../../../../../components/ascribe_forms/input_textarea_toggable';
import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import FurtherDetailsFileuploader from '../../../../../ascribe_detail/further_details_fileuploader';

import InputCheckbox from '../../../../../ascribe_forms/input_checkbox';
import ListRequestActions from '../../../../../ascribe_forms/list_form_request_actions';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import DetailProperty from '../../../../../ascribe_detail/detail_property';

import ApiUrls from '../../../../../../constants/api_urls';
import { mergeOptions } from '../../../../../../utils/general_utils';
import { getLangText } from '../../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../../utils/dom_utils';


/**
 * This is the component that implements resource/data specific functionality
 */
let PrizePieceContainer = React.createClass({
    propTypes: {
        selectedPrizeActionButton: React.PropTypes.func,

        // Provided from PrizeApp
        currentUser: React.PropTypes.object.isRequired,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },

    mixins: [ReactError],

    getInitialState() {
        return PieceStore.getInitialState();
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);

        this.loadPiece();
    },

    // This is done to update the container when the user clicks on the prev or next
    // button to update the URL parameter (and therefore to switch pieces) or
    // when the user clicks on a notification while being in another piece view
    componentWillReceiveProps(nextProps) {
        if (this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.flushPiece();
            this.loadPiece(nextProps.params.pieceId);
        }
    },

    componentDidUpdate() {
        const { pieceMeta: { err: pieceErr } } = this.state;

        if (pieceErr && pieceErr.status === 404) {
            this.throws(new ResourceNotFoundError(getLangText("Oops, the piece you're looking for doesn't exist.")));
        }
    },

    componentWillUnmount() {
        PieceStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getActions() {
        const { currentUser } = this.props;
        const { piece } = this.state;

        if (piece.notifications && piece.notifications.length > 0) {
            return (
                <ListRequestActions
                    pieceOrEditions={piece}
                    currentUser={currentUser}
                    handleSuccess={this.loadPiece}
                    notifications={piece.notifications} />);
        }
    },

    loadPiece(pieceId = this.props.params.pieceId) {
        PieceActions.fetchPiece(pieceId);
    },

    render() {
        const { currentUser, selectedPrizeActionButton } = this.props;
        const { piece } = this.state;

        if (piece.id) {
            /*

                This really needs a refactor!

                    - Tim

             */
            // Only show the artist name if you are the participant or if you are a judge and the piece is shortlisted
            let artistName;
            if ((currentUser.is_jury && !currentUser.is_judge) || (currentUser.is_judge && !piece.selected )) {
                artistName = <span className="glyphicon glyphicon-eye-close" aria-hidden="true" />;
                setDocumentTitle(piece.title);
            } else {
                artistName = piece.artist_name;
                setDocumentTitle(`${artistName}, ${piece.title}`);
            }

            // Only show the artist email if you are a judge and the piece is shortlisted
            const artistEmail = currentUser.is_judge && piece.selected ? (
                <DetailProperty
                    label={getLangText('REGISTREE')}
                    value={piece.user_registered} />
            ) : null;

            return (
                <Piece
                    piece={piece}
                    currentUser={currentUser}
                    header={
                        <div className="ascribe-detail-header">
                            <NavigationHeader
                                piece={piece}
                                currentUser={currentUser} />

                            <h1 className="ascribe-detail-title">{piece.title}</h1>
                            <DetailProperty label={getLangText('BY')} value={artistName} />
                            <DetailProperty label={getLangText('DATE')} value={Moment(piece.date_created, 'YYYY-MM-DD').year()} />
                            {artistEmail}
                            {this.getActions()}
                            <hr />
                        </div>
                    }
                    subheader={
                        <PrizePieceRatings
                            loadPiece={this.loadPiece}
                            piece={piece}
                            currentUser={currentUser}
                            selectedPrizeActionButton={selectedPrizeActionButton} />
                    }>
                    <PrizePieceDetails piece={piece} />
                </Piece>
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <AscribeSpinner color='dark-blue' size='lg' />
                </div>
            );
        }
    }
});

let NavigationHeader = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        piece: React.PropTypes.object.isRequired
    },

    render() {
        const { currentUser, piece } = this.props;

        if (currentUser.email && currentUser.is_judge && currentUser.is_jury && !currentUser.is_admin && piece.navigation) {
            const nav = piece.navigation;

            return (
                <div style={{marginBottom: '1em'}}>
                    <div className="row no-margin">
                        <Link className="disable-select" to={`/pieces/${ nav.prev_index || piece.id }`}>
                            <span className="glyphicon glyphicon-chevron-left pull-left link-ascribe" aria-hidden="true">
                            {getLangText('Previous')}
                            </span>
                        </Link>
                        <Link className="disable-select" to={`/pieces/${ nav.next_index || piece.id }`}>
                            <span className="pull-right link-ascribe">
                                {getLangText('Next')}
                                <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                            </span>
                        </Link>
                    </div>
                    <hr/>
                </div>
            );
        } else {
            return null;
        }
    }
});


let PrizePieceRatings = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        loadPiece: React.PropTypes.func.isRequired,
        piece: React.PropTypes.object.isRequired,

        selectedPrizeActionButton: React.PropTypes.func
    },

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            PrizeStore.getState(),
            PrizeRatingStore.getInitialState()
        );
    },

    componentDidMount() {
        PrizeRatingStore.listen(this.onChange);
        PrizeStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);

        PrizeActions.fetchPrize();
        this.fetchRatingsIfAuthorized();
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser.email !== this.props.currentUser.email) {
            this.fetchRatingsIfAuthorized();
        }
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        PrizeStore.unlisten(this.onChange);
        PrizeRatingStore.unlisten(this.onChange);
    },

    // The StarRating component does not have a property that lets us set
    // a default value at initialization. Since the ratingCache would otherwise on
    // every mouseover be overridden, we need to set it ourselves initially to deal
    // with the problem.
    onChange(state) {
        if (state.prize && state.prize.active_round != this.state.prize.active_round) {
            this.fetchRatingsIfAuthorized(state);
        }

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

    fetchRatingsIfAuthorized(state = this.state) {
        const { currentUser: {
                    is_admin: isAdmin,
                    is_judge: isJudge,
                    is_jury: isJury
                },
                piece: { id: pieceId } } = this.props;

        if (state.prize && 'active_round' in state.prize && (isAdmin || isJudge || isJury)) {
            PrizeRatingActions.fetchOne(pieceId, state.prize.active_round);
            PrizeRatingActions.fetchAverage(pieceId, state.prize.active_round);
        }
    },

    onRatingClick(event, args) {
        event.preventDefault();
        PrizeRatingActions
            .createRating(this.props.piece.id, args.rating, this.state.prize.active_round)
            .then(this.refreshPieceData);
    },

    getSelectedActionButton() {
        const { currentUser, piece, selectedPrizeActionButton: SelectedPrizeActionButton } = this.props;

        if (piece.selected && SelectedPrizeActionButton) {
            return (
                <span className="pull-right">
                    <SelectedPrizeActionButton
                        piece={piece}
                        currentUser={currentUser} />
                </span>
            );
        }
    },

    refreshPieceData() {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        this.props.loadPiece();
        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
    },

    onSelectChange() {
        PrizeRatingActions
            .toggleShortlist(this.props.piece.id)
            .then((res) => {
                this.refreshPieceData();

                if (res && res.notification) {
                    const notification = new GlobalNotificationModel(res.notification, 'success', 2000);
                    GlobalNotificationActions.appendGlobalNotification(notification);
                }
            });
    },

    render() {
        if (this.props.piece.id && this.props.currentUser.is_judge && this.state.average) {
            // Judge sees shortlisting, average and per-jury notes
            return (
                <div>
                    <CollapsibleParagraph
                        title={getLangText('Shortlisting')}
                        defaultExpanded={true}>
                        <div className="row no-margin">
                            <span className="ascribe-checkbox-wrapper" style={{marginLeft: '1.5em'}}>
                                <InputCheckbox
                                    defaultChecked={this.props.piece.selected}
                                    onChange={this.onSelectChange}>
                                    <span>
                                        {getLangText('Select for the prize')}
                                    </span>
                                </InputCheckbox>
                            </span>
                            {this.getSelectedActionButton()}
                        </div>
                        <hr />
                    </CollapsibleParagraph>
                    <CollapsibleParagraph
                        title={getLangText('Average Rating')}
                        defaultExpanded={true}>
                        <div id="list-rating" style={{marginLeft: '1.5em', marginBottom: '1em'}}>
                            <StarRating
                                ref='average-rating'
                                name="average-rating"
                                caption=""
                                size='md'
                                step={0.5}
                                rating={this.state.average}
                                ratingAmount={5} />
                        </div>
                        <hr />
                        {this.state.ratings.map((item, i) => {
                            let note = item.note ? (
                                <div className="rating-note">
                                    note: {item.note}
                                </div>
                            ) : null;

                            return (
                                <div
                                    key={item.user}
                                    className="rating-list">
                                    <div
                                        id="list-rating"
                                        className="row no-margin">
                                    <span className="pull-right">
                                        <StarRating
                                            ref={'rating' + i}
                                            name={'rating' + i}
                                            caption=""
                                            size='sm'
                                            step={0.5}
                                            rating={item.rating}
                                            ratingAmount={5} />
                                    </span>
                                    <span> {item.user}</span>
                                        {note}
                                    </div>
                                </div>
                            );
                        })}
                        <hr />
                    </CollapsibleParagraph>
                </div>);
        } else if (this.props.currentUser.is_jury) {
            // Jury can set rating and note
            return (
                <CollapsibleParagraph
                    title={getLangText('Rating')}
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
                        id={() => ({ 'piece_id': this.props.piece.id })}
                        label={getLangText('Jury note')}
                        defaultValue={this.props.piece.note_from_user || null}
                        placeholder={getLangText('Enter your comments ...')}
                        editable={true}
                        successMessage={getLangText('Jury note saved')}
                        url={ApiUrls.notes}
                        currentUser={this.props.currentUser} />
                </CollapsibleParagraph>);
        } else {
            return null;
        }
    }
});


let PrizePieceDetails = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired
    },

    render() {
        const { piece } = this.props;

        if (piece.prize && piece.prize.name && Object.keys(piece.extra_data).length) {
            return (
                <CollapsibleParagraph
                    title={getLangText('Prize Details')}
                    defaultExpanded={true}>
                    <Form>
                        {Object
                            .keys(piece.extra_data)
                            .sort()
                            .map((data) => {
                                // Remove leading number (for sorting), if any, and underscores with spaces
                                const label = data.replace(/^\d-/, '').replace(/_/g, ' ');
                                const value = piece.extra_data[data] || 'N/A';

                                return (
                                    <Property
                                        key={label}
                                        name={data}
                                        label={label}
                                        editable={false}
                                        overrideForm={true}>
                                        <InputTextAreaToggable
                                            rows={1}
                                            defaultValue={value} />
                                    </Property>
                                );
                            })
                        }
                        <FurtherDetailsFileuploader
                            submitFile={() => {}}
                            setIsUploadReady={() => {}}
                            isReadyForFormSubmission={() => {}}
                            editable={false}
                            overrideForm={true}
                            pieceId={piece.id}
                            otherData={piece.other_data}
                            multiple={true} />
                    </Form>
                </CollapsibleParagraph>
            );
        } else {
            return null;
        }
    }
});

export default PrizePieceContainer;
